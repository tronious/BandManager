<!-- VideosPage.vue -- 
This view displays a list of video thumbnails on the left sidebar. When a thumbnail is clicked, the corresponding YouTube video is embedded and played on the right side.
-->
<template>
  <div class="videos-page-flex-outer">
    <div class="videos-header-row" ref="headerRef">
      <div class="videos-page-header">
        <PageHeader title="Videos" subtitle="Band performances and highlights" />
      </div>
      <div class="videos-sidebar">
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

function setHeaderHeightVar() {
  if (outer.value && headerRef.value) {
    const h = headerRef.value.offsetHeight || 120;
    outer.value.style.setProperty('--header-height', `${h}px`);
  }
}

onMounted(() => {
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
});

onUnmounted(() => {
  window.removeEventListener('resize', setHeaderHeightVar);
});

// Select a video to play
function selectVideo(video) {
  selectedVideo.value = video;
}

/* Extracts the YouTube video ID from a URL and constructs the thumbnail URL */
function getThumbnailUrl(url) {
  // thank you chatgpt for this regex and this function LOL...regex's are not my forte
  const match =
    url.match(/[?&]v=([\w-]{11})/) || url.match(/youtu\.be\/([\w-]{11})/);
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
  }

  .videos-container {
    padding: 0.75rem 1rem;
    gap: 1rem;
  }

  .video-thumb {
    flex: 0 0 140px;
    min-width: 140px;
  }

  .thumb-title {
    font-size: 0.8rem;
  }
}

@media (max-width: 640px) {
  .videos-header-row {
    padding-right: 0.75rem;
  }

  .videos-container {
    padding: 0.5rem 0.75rem;
    gap: 0.75rem;
  }

  .videos-sidebar {
    gap: 0.75rem;
  }

  .video-thumb {
    flex: 0 0 120px;
    min-width: 120px;
  }

  .thumb-title {
    font-size: 0.7rem;
  }
}
</style>
