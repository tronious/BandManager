<!-- VideosPage.vue -- 
This view displays a list of video thumbnails on the left sidebar. When a thumbnail is clicked, the corresponding YouTube video is embedded and played on the right side.
-->
<template>
  <div class="videos-page-flex-outer">
    <div class="videos-page-header">
      <PageHeader title="Videos" subtitle="Band performances and highlights" />
    </div>
    <div class="videos-flex-layout">
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
      <div v-if="selectedVideo" class="selected-video-player">
        <YouTubeEmbed :url="selectedVideo.url" :title="selectedVideo.title" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useVideosStore } from "@/stores/videos.js";
import PageHeader from "@/components/PageHeader.vue";
import YouTubeEmbed from "@/components/YouTubeEmbed.vue";

// Access the videos store - Blockbuster where have you been all my life
const videosStore = useVideosStore();
// For now we use hardcoded videos in the store
const videos = videosStore.videos;

// needs to be a ref because we will change it on click
const selectedVideo = ref(null);

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
/* Layout: sidebar (thumbnails) left, large player right */
.videos-page-flex-outer {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}
.videos-page-header {
  flex: 0 0 auto;
}
.videos-flex-layout {
  display: flex;
  flex-direction: row;
  flex: 1 1 0;
  min-height: 0;
  max-width: 100vw;
  overflow: hidden;
  gap: 2.5rem;
}
.videos-sidebar {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.5rem;
  width: 340px;
  min-width: 220px;
  max-width: 340px;
  padding: 1rem 0;
  height: 100%;
  flex: 0 0 340px;
  min-height: 0;
  overflow: hidden;
}
/* Make video thumbnails clickable and style selected player */
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
  padding: 0.5rem 0.5rem 1rem 0.5rem;
  width: 100%;
  flex: 1 1 0;
  min-height: 0;
  max-width: 320px;
}
.video-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
  flex: 1 1 0;
  min-height: 0;
}
.video-thumb:hover {
  opacity: 1;
  transform: scale(1.04);
}
.thumb-title {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
  margin-top: 0.25rem;
}
.selected-video-player {
  flex: 1 1 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  padding: 50px;
}
.selected-video-player .video-embed {
  aspect-ratio: 16/9;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.selected-video-player iframe {
  width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 1rem;
}
</style>
