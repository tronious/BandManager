const express = require('express')
const crypto = require('crypto')
const multer = require('multer')
const rateLimit = require('express-rate-limit')
const { supabase } = require('../lib/supabase')

const router = express.Router()

const BUCKET = process.env.SUPABASE_PHOTOS_BUCKET || 'event-photos'
const MAX_FILE_SIZE_BYTES = Number(process.env.PHOTO_MAX_BYTES || 10 * 1024 * 1024) // 10MB

function isProd() {
  return String(process.env.NODE_ENV || '').toLowerCase() === 'production'
}

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY)
}

function configGuard(req, res) {
  if (supabaseConfigured()) return true
  res.status(500).json({
    error: 'Server not configured for photo uploads (missing SUPABASE_URL / SUPABASE_SERVICE_KEY).',
  })
  return false
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (req, file, cb) => {
    if (!file?.mimetype || !String(file.mimetype).startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed'))
    }
    cb(null, true)
  },
})

const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10, // 10 uploads per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many uploads from this IP. Please try again later.',
  },
  keyGenerator: (req) => req.ip,
})

function safeFileName(originalName) {
  const raw = String(originalName || 'photo')
  const normalized = raw.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  return normalized.slice(0, 120) || 'photo'
}

function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data?.publicUrl || ''
}

function isMissingTableError(error) {
  const msg = String(error?.message || '').toLowerCase()
  const code = String(error?.code || '').toLowerCase()
  // PostgREST may surface missing relations as 42P01 or PGRST205 depending on path.
  if (code === '42p01' || code === 'pgrst205') return true
  if (msg.includes('event_photos') && msg.includes('does not exist')) return true
  if (msg.includes('could not find the') && msg.includes('event_photos')) return true
  if (msg.includes('relation') && msg.includes('event_photos') && msg.includes('does not exist')) return true
  return false
}

async function ensureBucketExists() {
  if (!supabase?.storage) return
  if (typeof supabase.storage.createBucket !== 'function') return

  try {
    await supabase.storage.createBucket(BUCKET, { public: true })
  } catch (err) {
    // Ignore if it already exists, or if creation isn't allowed.
    const msg = String(err?.message || '').toLowerCase()
    if (msg.includes('already exists')) return
  }
}

router.get('/events/:eventId/photos', async (req, res) => {
  try {
    if (!configGuard(req, res)) return

    const { eventId } = req.params
    if (!eventId) return res.status(400).json({ error: 'Missing eventId' })

    // Prefer DB records if available (lets us store captions, etc).
    const { data, error } = await supabase
      .from('event_photos')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (!error) {
      return res.json(Array.isArray(data) ? data : [])
    }

    // If table isn't set up yet, fall back to listing objects in storage.
    if (!isMissingTableError(error)) throw error

    const { data: objects, error: listError } = await supabase.storage.from(BUCKET).list(eventId, {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    })

    if (listError) throw listError

    const photos = (objects || [])
      .filter((o) => o && o.name && !o.name.endsWith('/'))
      .map((o) => {
        const storage_path = `${eventId}/${o.name}`
        return {
          id: storage_path,
          event_id: eventId,
          storage_path,
          url: getPublicUrl(BUCKET, storage_path),
          caption: null,
          created_at: o.created_at || o.updated_at || null,
        }
      })
      .filter((p) => p.url)

    res.json(photos)
  } catch (err) {
    console.error('Error fetching event photos:', err)
    res.status(500).json({
      error: 'Failed to fetch photos',
      ...(isProd()
        ? null
        : {
            details: {
              message: err?.message || String(err),
              code: err?.code || undefined,
            },
          }),
    })
  }
})

router.post('/events/:eventId/photos', uploadRateLimiter, upload.single('photo'), async (req, res) => {
  try {
    if (!configGuard(req, res)) return

    const { eventId } = req.params
    if (!eventId) return res.status(400).json({ error: 'Missing eventId' })

    const file = req.file
    if (!file) return res.status(400).json({ error: 'Missing photo file' })

    const ext = String(file.originalname || '')
      .split('.')
      .pop()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')

    const fileName = safeFileName(file.originalname)
    const random = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex')
    const path = `${eventId}/${Date.now()}-${random}-${fileName}${ext ? `.${ext}` : ''}`

    let uploadError = null
    ;({ error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    }))

    if (uploadError) {
      const msg = String(uploadError?.message || '').toLowerCase()
      const code = String(uploadError?.statusCode || uploadError?.status || '')

      // If the bucket doesn't exist yet, attempt to create it and retry once.
      if (msg.includes('bucket') && (msg.includes('not found') || msg.includes('does not exist') || code === '404')) {
        await ensureBucketExists()
        ;({ error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        }))
      }
    }

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError)
      return res.status(500).json({
        error:
          'Failed to upload photo (check Supabase Storage bucket exists and your server key has access).',
        ...(isProd()
          ? null
          : {
              details: {
                message: uploadError?.message || String(uploadError),
                status: uploadError?.statusCode || uploadError?.status || undefined,
              },
            }),
      })
    }

    const url = getPublicUrl(BUCKET, path)
    if (!url) {
      return res.status(500).json({ error: 'Photo uploaded but URL could not be created (is the bucket public?)' })
    }

    const caption = typeof req.body?.caption === 'string' ? req.body.caption.trim().slice(0, 200) : null

    const { data: inserted, error: insertError } = await supabase
      .from('event_photos')
      .insert([
        {
          event_id: eventId,
          storage_path: path,
          url,
          caption,
          uploader_ip: req.ip || null,
        },
      ])
      .select('*')
      .single()

    if (!insertError) {
      return res.status(201).json(inserted)
    }

    // If DB isn't set up yet, still succeed for "just get adding working".
    if (isMissingTableError(insertError)) {
      return res.status(201).json({
        id: path,
        event_id: eventId,
        storage_path: path,
        url,
        caption,
        uploader_ip: req.ip || null,
        created_at: new Date().toISOString(),
      })
    }

    console.error('Supabase insert error:', insertError)
    return res.status(500).json({ error: 'Failed to save photo record' })
  } catch (err) {
    const message = String(err?.message || '')
    if (message.toLowerCase().includes('file too large')) {
      return res.status(413).json({ error: 'File too large' })
    }

    console.error('Error uploading event photo:', err)
    res.status(500).json({
      error: 'Failed to upload photo',
      ...(isProd()
        ? null
        : {
            details: {
              message: err?.message || String(err),
              code: err?.code || undefined,
            },
          }),
    })
  }
})

module.exports = router
