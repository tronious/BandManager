import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useVideosStore = defineStore('videos', () => {
  // ============ STATE ============
  const videos = ref([
    {
      url: 'https://www.youtube.com/embed/VX-C9F4sbvs?si=8GBQ6ZbM4opZXtqP',
      title: 'Perfect to Me (Original)'
    },
    {
      url: 'https://www.youtube.com/embed/hHYUmVNPTwk?si=qzjtIgfJq9E5zR11',
      title: 'Lose Control'
    },
    {
      url: 'https://www.youtube.com/embed/y09rlOT7EVo?si=CZJnXaC3coF1TjBL',
      title: 'Poison and Wine'
    }
  ])

  // ============ RETURN ============
  return {
    videos
  }
})
