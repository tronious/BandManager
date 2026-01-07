<!-- YouTubeEmbed.vue -
This component embeds a YouTube video given its URL.  In the future make this  more robust to not have to hardcode
video ID's and instead use an admin page to manage videos.  -->
<template>
  <div class="video-embed">
    <iframe
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
    // Extract video ID from full YouTube URL
    videoId() {
      const match = this.url.match(/[?&]v=([\w-]{11})/) || this.url.match(/youtu\.be\/([\w-]{11})/);
      return match ? match[1] : '';
    },
    // Construct the embed URL with origin parameter for cross-origin compatibility
    embedUrl() {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      return `https://www.youtube.com/embed/${this.videoId}?origin=${encodeURIComponent(origin)}&rel=0`;
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
