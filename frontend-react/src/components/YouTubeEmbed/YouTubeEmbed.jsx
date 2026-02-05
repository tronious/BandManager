import './YouTubeEmbed.css'

function extractVideoId(url) {
  if (!url) return ''
  let match = String(url).match(/[?&]v=([\w-]{11})/)
  if (match) return match[1]
  match = String(url).match(/youtu\.be\/([\w-]{11})/)
  if (match) return match[1]
  match = String(url).match(/\/embed\/([\w-]{11})/)
  return match ? match[1] : ''
}

function toEmbedUrl(url) {
  const str = String(url || '')
  if (str.includes('/embed/') && str.includes('youtube.com/embed/')) return str
  const videoId = extractVideoId(str)
  if (!videoId) return str
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
}

export function YouTubeEmbed({ url, title = 'YouTube video' }) {
  const embedUrl = toEmbedUrl(url)

  return (
    <div className="video-embed">
      <iframe
        src={embedUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title={title}
      />
    </div>
  )
}
