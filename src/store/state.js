import mode from './modeType'
export default {
  isFullScreen: false,
  isShowMiniPlayer: false,
  isShowListPlayer: false,
  isPlaying: false,
  modeType: mode.loop,
  songs: [],
  currentSong: {},
  currentIndex: 0,
  currentLyric: {},
  currentTime: 0,
  totalTime: 0,
  clickTime: 0,
  favoriteList: [],
  historyList: []
}
