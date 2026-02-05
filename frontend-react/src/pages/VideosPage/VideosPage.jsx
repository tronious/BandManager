import { useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { YouTubeEmbed } from '@/components/YouTubeEmbed/YouTubeEmbed.jsx'
import { PageHeader } from '@/components/shared/PageHeader.jsx'
import './VideosPage.css'

function getThumbnailUrl(url) {
  const match =
    String(url).match(/[?&]v=([\w-]{11})/) ||
    String(url).match(/youtu\.be\/([\w-]{11})/) ||
    String(url).match(/\/embed\/([\w-]{11})/)
  const id = match ? match[1] : ''
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

export function VideosPage() {
  const videos = useSelector((state) => state.videos?.videos || [])
  const [selectedVideo, setSelectedVideo] = useState(null)

  const sidebarRef = useRef(null)
  const [showScrollHint, setShowScrollHint] = useState(true)

  const thumbnails = useMemo(
    () => videos.map((video) => ({ ...video, thumbnail: getThumbnailUrl(video.url) })),
    [videos],
  )

  useEffect(() => {
    if (!selectedVideo && videos.length > 0) {
      setSelectedVideo(videos[0])
    }
  }, [selectedVideo, videos])

  useEffect(() => {
    function checkScrollPosition() {
      const el = sidebarRef.current
      if (!el) return
      const { scrollLeft, scrollWidth, clientWidth } = el
      const hasOverflow = scrollWidth > clientWidth
      const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 5
      setShowScrollHint(hasOverflow && !isAtEnd)
    }

    const el = sidebarRef.current
    if (!el) return

    el.addEventListener('scroll', checkScrollPosition)
    window.addEventListener('resize', checkScrollPosition)
    checkScrollPosition()

    return () => {
      el.removeEventListener('scroll', checkScrollPosition)
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [])

  return (
    <div className="videos-page-flex-outer">
      <div className="videos-header-row">
        <div className="videos-page-header">
          <PageHeader title="Videos" subtitle="Band performances and highlights" />
        </div>

        <div className="videos-sidebar" ref={sidebarRef}>
          {thumbnails.map((video) => (
            <div
              key={video.url}
              className="video-thumb"
              onClick={() => setSelectedVideo(video)}
              title={video.title}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedVideo(video)
              }}
            >
              <img src={video.thumbnail} alt={video.title} />
              <div className="thumb-title">{video.title}</div>
            </div>
          ))}
        </div>

        {showScrollHint ? (
          <div className="scroll-hint">
            <span>→</span>
          </div>
        ) : null}
      </div>

      <div className="videos-container">
        {selectedVideo ? (
          <div className="selected-video-player">
            <YouTubeEmbed url={selectedVideo.url} title={selectedVideo.title} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
