import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  videos: [
    {
      url: 'https://youtu.be/VX-C9F4sbvs?si=2pDaLHCy7QFIzd-t',
      title: 'Perfect to Me (Original)',
    },
    {
      url: 'https://youtu.be/hHYUmVNPTwk?si=LipslepI09WhO76n',
      title: 'Lose Control (Teddy Swims)'
    },
    {
      url: 'https://youtu.be/lZMkPtGnZ8s?si=7Z0Tan8-lDXl7vgZ',
      title: 'Save Me (Jelly Roll)'
    },
    {
      url: 'https://youtu.be/MM2vqSQTQlg?si=WK4e9JfoZuLGmpZL',
      title: 'Wicked Game (Chris Issak)',
    },
    {
      url: 'https://youtu.be/xgUR59omsBo?si=IyYPn8bXnof5X55P',
      title: 'Time After Time (Cindi Lauper)',
    }
  ],
}

const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setVideos(state, action) {
      state.videos = action.payload
    },
  },
})

export const { setVideos } = videosSlice.actions
export const videosReducer = videosSlice.reducer
