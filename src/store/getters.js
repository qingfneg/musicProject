export default {
  isFullScreen (state) {
    // console.log(state.isShowListPlayer)
    return state.isFullScreen
  },
  isShowMiniPlayer (state) {
    return state.isShowMiniPlayer
  },
  isShowListPlayer (state) {
    return state.isShowListPlayer
  },
  isPlaying (state) {
    return state.isPlaying
  },
  modeType  (state) {
    return state.modeType
  },
  songs  (state) {
    return state.songs
  },
  currentIndex (state) {
    return state.currentIndex
  },
  currentSong (state) {
    let obj = {
      name: '',
      singer: '',
      picUrl: null
    }
    if (state.songs.length !== 0) {
      obj = state.songs[state.currentIndex]
    }
    return obj
  },
  currentLyric  (state) {
    return state.currentLyric
  },
  currentTime (state) {
    return state.currentTime
  },
  totalTime (state) {
    return state.totalTime
  },
  clickTime (state) {
    return state.clickTime
  },
  favoriteList  (state) {
    return state.favoriteList
  },
  historyList (state) {
    return state.historyList
  }
}
