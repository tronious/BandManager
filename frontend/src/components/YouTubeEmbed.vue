<!-- YouTubeEmbed.vue -
This component embeds a YouTube video given its URL.  In the future make this  more robust to not have to hardcode
video ID's and instead use an admin page to manage videos.  -->
<template>
  <div class="video-embed">
    <iframe
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      :title="title"
    ></iframe>
  </div>
</template>

<script>
// Extract the video ID from a YouTube URL
export default {
  name: 'YouTubeEmbed',
  props: {
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'YouTube video'
    }
  },
  computed: {
    // Check if URL is already an embed URL
    isEmbedUrl() {
      return this.url.includes('/embed/');
    },
    // Extract video ID from full YouTube URL
    videoId() {
      // First try the standard watch URL format
      let match = this.url.match(/[?&]v=([\w-]{11})/);
      if (match) return match[1];
      // Try youtu.be short URL format
      match = this.url.match(/youtu\.be\/([\w-]{11})/);
      if (match) return match[1];
      // Try embed URL format
      match = this.url.match(/\/embed\/([\w-]{11})/);
      return match ? match[1] : '';
    },
    // Use embed URL directly if provided, otherwise construct from video ID
    embedUrl() {
      if (this.isEmbedUrl && this.url.includes('youtube.com/embed/')) {
        return this.url;
      }
      const videoId = this.videoId;
      if (!videoId) {
        return this.url; // fallback to original URL if we can't extract ID
      }
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
  }
}
</script>

<style scoped>
.video-embed {
  width: 100%;
  aspect-ratio: 16/9;
  margin-bottom: 2rem;
}
.video-embed iframe {
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  background: #000;
}
</style>
