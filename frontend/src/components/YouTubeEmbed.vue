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
    videoId() {
      // Extract video ID from various YouTube URL formats
      const match = this.url.match(/[?&]v=([\w-]{11})/) || this.url.match(/youtu\.be\/([\w-]{11})/);
      return match ? match[1] : '';
    },
    embedUrl() {
      return this.videoId ? `https://www.youtube.com/embed/${this.videoId}` : '';
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
