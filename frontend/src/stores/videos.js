import { defineStore } from 'pinia'

export const useVideosStore = defineStore('videos', {
    state: () => ({
        videos: [
            {
                url: 'https://www.youtube.com/watch?v=VX-C9F4sbvs',
                title: 'Perfect to Me (Original)'
            },
            {
                url: 'https://www.youtube.com/watch?v=hHYUmVNPTwk',
                title: 'Lose Control'
            },
            {
                url: 'https://www.youtube.com/watch?v=gMI9BVHXYy8',
                title: 'Promo'
            }
        ]
    })
})
