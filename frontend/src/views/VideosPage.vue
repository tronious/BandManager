<!-- VideosPage.vue -- 
This view displays a list of video thumbnails on the left sidebar. When a thumbnail is clicked, the corresponding YouTube video is embedded and played on the right side.
-->
<template>
  <div class="videos-page-flex-outer">
    <div class="videos-header-row" ref="headerRef">
      <div class="videos-page-header">
        <PageHeader title="Videos" subtitle="Band performances and highlights" />
      </div>
      <div class="videos-sidebar" ref="sidebarRef">
        <div
          v-for="video in videos"
          :key="video.url"
          class="video-thumb"
          @click="selectVideo(video)"
          :title="video.title"
        >
          <img :src="getThumbnailUrl(video.url)" :alt="video.title" />
          <div class="thumb-title">{{ video.title }}</div>
        </div>
      </div>
      <div class="scroll-hint" v-show="showScrollHint">
        <span>→</span>
      </div>
    </div>
    <div class="videos-container">
      <div v-if="selectedVideo" class="selected-video-player">
        <YouTubeEmbed :url="selectedVideo.url" :title="selectedVideo.title" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { onMounted, onUnmounted } from 'vue';
import { useVideosStore } from "@/stores/videos.js";
import PageHeader from "@/components/PageHeader.vue";
import YouTubeEmbed from "@/components/YouTubeEmbed.vue";

// Access the videos store - Blockbuster where have you been all my life
const videosStore = useVideosStore();
// For now we use hardcoded videos in the store
const videos = videosStore.videos;

// needs to be a ref because we will change it on click
const selectedVideo = ref(null);

// refs for measuring header height so we can size thumbnails to avoid scrollbars
const outer = ref(null);
const headerRef = ref(null);
const sidebarRef = ref(null);
const showScrollHint = ref(true);

function setHeaderHeightVar() {
  if (outer.value && headerRef.value) {
    const h = headerRef.value.offsetHeight || 120;
    outer.value.style.setProperty('--header-height', `${h}px`);
  }
}

function checkScrollPosition() {
  if (!sidebarRef.value) return;
  const { scrollLeft, scrollWidth, clientWidth } = sidebarRef.value;
  // Hide hint if no overflow or scrolled to the end (with a small tolerance)
  const hasOverflow = scrollWidth > clientWidth;
  const isAtEnd = scrollLeft >= scrollWidth - clientWidth - 5;
  showScrollHint.value = hasOverflow && !isAtEnd;
}

onMounted(() => {
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
  if (sidebarRef.value) {
    sidebarRef.value.addEventListener('scroll', checkScrollPosition);
    // Check initial state and recheck on resize
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', setHeaderHeightVar);
  window.removeEventListener('resize', checkScrollPosition);
  if (sidebarRef.value) {
    sidebarRef.value.removeEventListener('scroll', checkScrollPosition);
  }
});

// Select a video to play
function selectVideo(video) {
  selectedVideo.value = video;
}

/* Extracts the YouTube video ID from a URL and constructs the thumbnail URL */
function getThumbnailUrl(url) {
  // Handle watch URLs, short URLs, and embed URLs
  const match =
    url.match(/[?&]v=([\w-]{11})/) || 
    url.match(/youtu\.be\/([\w-]{11})/) ||
    url.match(/\/embed\/([\w-]{11})/);
  const id = match ? match[1] : "";
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
}
</script>

<style scoped>
/* Layout: header + thumbnails in a row, large player below */
.videos-page-flex-outer {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.videos-header-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2rem;
  flex: 0 0 auto;
  padding-right: 2rem;
  overflow: hidden;
  position: relative;
}

.videos-page-header {
  flex: 0 0 auto;
}

.videos-sidebar {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex: 1 1 0;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0.5rem 0;
  position: relative;
}

.scroll-hint {
  position: absolute;
  right: 1rem;
  top: 50%;
  /* transform: translateY(-50%); */
  /* background: linear-gradient(to right, transparent, rgba(10, 10, 11, 0.95) 30%); */
  padding: 1rem 1.5rem 1rem 3rem;
  pointer-events: none;
  z-index: 10;
  display: none;
  opacity: 0.85;
}

.scroll-hint span {
  font-size: 3rem;
  color: #f87171;
  animation: slideRight 1.5s ease-in-out infinite;
  display: block;
}

@keyframes slideRight {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(8px);
    opacity: 1;
  }
}

.videos-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
  padding: 1rem 2rem;
  gap: 2rem;
}

.video-thumb {
  cursor: pointer;
  opacity: 0.85;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #18181b;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.18);
  padding: 0.5rem;
  flex: 0 0 180px;
  min-width: 180px;
}

.video-thumb img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}

.video-thumb:hover {
  opacity: 1;
  transform: scale(1.04);
}

.thumb-title {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.25rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.selected-video-player {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0a0a0a;
  border-radius: 1rem;
  max-width: 900px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
}

.selected-video-player .video-embed {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.selected-video-player iframe {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
}

@media (max-width: 768px) {
  .videos-header-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding-right: 1rem;
  }

  .videos-sidebar {
    width: 100%;
    min-height: fit-content;
    height: auto;
  }

  .scroll-hint {
    display: block;
  }

  .videos-container {
    padding: 0.75rem 1rem;
    gap: 1rem;
  }

  .video-thumb {
    flex: 0 0 auto;
    min-width: 140px;
    max-width: 160px;
  }

  .thumb-title {
    font-size: 0.8rem;
  }

  .selected-video-player {
    max-width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
  }
}

@media (max-width: 640px) {
  .videos-header-row {
    padding-right: 0.5rem;
    gap: 0.75rem;
  }

  .videos-page-header {
    padding: 0 0.5rem;
  }

  .videos-container {
    padding: 0.75rem 0.5rem;
    gap: 0.75rem;
  }

  .videos-sidebar {
    gap: 0.75rem;
    padding: 0.5rem;
    min-height: fit-content;
    height: auto;
  }

  .video-thumb {
    flex: 0 0 auto;
    min-width: 130px;
    max-width: 150px;
  }

  .video-thumb img {
    width: 100%;
    height: auto;
  }

  .thumb-title {
    font-size: 0.75rem;
    -webkit-line-clamp: 2;
  }

  .selected-video-player {
    max-width: 100%;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 0.5rem;
  }

  .selected-video-player iframe {
    border-radius: 0.5rem;
  }
}
</style>
