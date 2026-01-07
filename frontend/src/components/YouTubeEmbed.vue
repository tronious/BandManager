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
    videoId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: 'YouTube video'
    }
  },
  computed: {
    // Construct the embed URL
    embedUrl() {
      return `https://www.youtube.com/embed/${this.videoId}`;
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
