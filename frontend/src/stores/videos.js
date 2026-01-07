import { defineStore } from 'pinia'

export const useVideosStore = defineStore('videos', {
    state: () => ({
        videos: [
            {
                url: 'https://www.youtube.com/embed/VX-C9F4sbvs?si=8GBQ6ZbM4opZXtqP',
                title: 'Perfect to Me (Original)'
            },
            {
                url: 'https://www.youtube.com/embed/hHYUmVNPTwk?si=qzjtIgfJq9E5zR11',
                title: 'Lose Control'
            },
            {
                url: 'https://www.youtube.com/embed/gMI9BVHXYy8?si=bcMA1fPrb_P9sgL_',
                title: 'Promo'
            }
        ]
    })
})
