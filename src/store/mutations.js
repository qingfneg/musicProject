// mutations: 用于保存修改全局共享的数据的方法
import {
  SET_FULL_SCREEN,
  SET_MINI_PLAYER,
  SET_LIST_PLAYER,
  SET_IS_PLAYING,
  SET_MODE_TYPE,
  SET_SONG_DETAIL,
  SET_SONG_LYRIC,
  SET_DEL_SONG,
  SET_CURRENT_INDEX,
  SET_CURRENT_TIME,
  SET_TOTAL_TIME,
  SET_CLICK_TIME,
  SET_FAVORITE_SONG,
  SET_FAVORITE_LIST,
  SET_HISTORY_SONG,
  SET_HISTORY_LIST
} from './mutations-type'
export default {
  // changeFullScreen (state, flag) {
  //   state.isFullScreen = flag
  // }
  // 这里常量的使用要用中括号括住才能使用
  [SET_FULL_SCREEN] (state, flag) {
    state.isFullScreen = flag
    if (flag) {
      state.isShowMiniPlayer = false
      state.isShowListPlayer = false
    }
  },
  [SET_MINI_PLAYER] (state, flag) {
    state.isShowMiniPlayer = flag
    if (flag) {
      state.isFullScreen = false
      state.isShowListPlayer = false
    }
  },
  [SET_LIST_PLAYER] (state, flag) {
    state.isShowListPlayer = flag
  },
  [SET_IS_PLAYING] (state, flag) {
    state.isPlaying = flag
  },
  [SET_MODE_TYPE] (state, flag) {
    state.modeType = flag
  },
  [SET_SONG_DETAIL] (state, list) {
    state.songs = list
  },
  [SET_SONG_LYRIC] (state, lyric) {
    state.currentLyric = lyric
  },
  [SET_DEL_SONG] (state, index) {
    // 假如有数据删除一条数据
    if (index !== undefined) {
      state.songs.splice(index, 1)
    } else {
      // 没有歌曲数据，歌曲等于空数组
      state.songs = []
    }
    // 假如删除的歌曲索引小于当前歌曲索引，当前歌曲-1
    if (index < state.currentIndex) {
      state.currentIndex = state.currentIndex - 1
    }
    // 假如歌曲列表没歌曲了
    if (state.songs.length === 0) {
      state.isFullScreen = false
      state.isShowMiniPlayer = false
      state.isShowListPlayer = false
    }
  },
  // 当前歌曲的索引
  [SET_CURRENT_INDEX] (state, index) {
    // 假如当前歌曲索引小于0,则歌曲索引变为歌曲最后一首歌的索引
    if (index < 0) {
      index = state.songs.length - 1
    } else if (index > state.songs.length - 1) {
      // 假如当前歌曲索大于最后的索引,则歌曲索引变为歌曲第一首歌的索引
      index = 0
    }
    state.currentIndex = index
  },
  [SET_CURRENT_TIME] (state, time) {
    state.currentTime = time
  },
  [SET_TOTAL_TIME] (state, time) {
    state.totalTime = time
  },
  [SET_CLICK_TIME] (state, time) {
    state.clickTime = time
  },
  // 收藏歌曲
  [SET_FAVORITE_SONG] (state, song) {
    // 查找当前歌曲的id是否在收藏列表中
    // find() 方法返回数组中满足提供的测试函数的第一个元素的值
    const result = state.favoriteList.find(function (currentValue) {
      return currentValue.id === song.id
    })
    // 没有在收藏列表中则收藏歌曲
    if (result === undefined) {
      state.favoriteList.push(song)
    }
  },
  [SET_FAVORITE_LIST] (state, list) {
    state.favoriteList = list
  },
  // 保存歌曲播放历史
  [SET_HISTORY_SONG] (state, song) {
    // 查找当前歌曲的id是否在历史播放列表中
    // find() 方法返回数组中满足提供的测试函数的第一个元素的值
    const result = state.historyList.find(function (currentValue) {
      return currentValue.id === song.id
    })
    if (result === undefined) {
      // 限制只能保存30条播放记录
      if (state.historyList > 30) {
        state.historyList.splice(0, 1)
      }
      state.historyList.push(song)
    }
  },
  [SET_HISTORY_LIST] (state, list) {
    state.favoriteList = list
  }
}
