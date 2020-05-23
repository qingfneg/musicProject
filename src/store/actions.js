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
import {
  getSongDetail,
  getSongURL,
  getSongLyric
} from '../api/index'
// actions: 用于保存触发mutations中保存的方法的方法
export default {
/*  setFullScreen ({ commit }, flag) {
    commit('changeFullScreen ', flag)
  } */
  setFullScreen ({ commit }, flag) {
    commit(SET_FULL_SCREEN, flag)
  },
  setMiniPlayer ({ commit }, flag) {
    commit(SET_MINI_PLAYER, flag)
  },
  setListPlayer ({ commit }, flag) {
    commit(SET_LIST_PLAYER, flag)
  },
  setIsPlaying ({ commit }, flag) {
    commit(SET_IS_PLAYING, flag)
  },
  setModeType ({ commit }, flag) {
    commit(SET_MODE_TYPE, flag)
  },
  async setSongDetail ({ commit }, ids) {
    // 判断一个变量是不是数组的方法: 实例 instanceof  构造函数constructor
    // console.log(ids instanceof Array)
    // console.log(ids.constructor === Array)
    // 调用例子 : /song/detail?ids=347230,/song/detail?ids=347230,347231
    // 演唱者多的时候拼接歌曲id
    let result = {}
    let urls = {}
    result = await getSongDetail({ ids: ids.join(',') })
    urls = await getSongURL({ id: ids.join(',') })
    // console.log(result)
    // console.log(urls)
    const list = []
    // 遍历所有歌曲里有用的信息，保存到list数组中返回
    result.songs.forEach(function (value) {
      const obj = {}
      // obj.url = urls.data[i].url
      for (let i = 0; i < urls.data.length; i++) {
        const item = urls.data[i]
        // 判断当前歌曲和播放地址id是否一致相同
        // 在点击全部播放时会去获取多少个的歌曲播放地址，加载地址时
        // 不是按歌曲列表按序加载到的，是不确定的
        if (value.id === item.id) {
          obj.url = item.url
          // console.log(obj.url)
          break
        }
      }
      // 保存播放歌曲id 和歌曲名,歌手，图片
      obj.id = value.id
      obj.name = value.name
      let singer = ''
      value.ar.forEach(function (item, index) {
        if (index === 0) {
          singer = item.name
        } else {
          singer += '-' + item.name
        }
      })
      obj.singer = singer
      obj.picUrl = value.al.picUrl
      list.push(obj)
    })
    // console.log(list)
    commit(SET_SONG_DETAIL, list)
  },
  async getSongLyric ({ commit }, id) {
    const result = await getSongLyric({ id: id })
    // 格式化歌词
    // console.log(result.lrc.lyric)
    // 有些歌没有歌词
    try {
      const obj = parseLyric(result.lrc.lyric)
      commit(SET_SONG_LYRIC, obj)
      // console.log('当前格式化的歌词', obj)
    } catch (e) {
      console.log('这首歌没歌词')
    }
  },
  setDelSong  ({ commit }, index) {
    commit(SET_DEL_SONG, index)
  },
  setCurrentIndex ({ commit }, index) {
    commit(SET_CURRENT_INDEX, index)
  },
  setCurrentTime ({ commit }, time) {
    commit(SET_CURRENT_TIME, time)
  },
  setClickTime ({ commit }, time) {
    commit(SET_CLICK_TIME, time)
  },
  setTotalTime ({ commit }, time) {
    commit(SET_TOTAL_TIME, time)
  },
  setFavoriteSong ({ commit }, song) {
    commit(SET_FAVORITE_SONG, song)
  },
  setFavoriteList ({ commit }, list) {
    commit(SET_FAVORITE_LIST, list)
  },
  setHistorySong ({ commit }, song) {
    commit(SET_HISTORY_SONG, song)
  },
  setHistoryList ({ commit }, list) {
    commit(SET_HISTORY_LIST, list)
  }
}
// 格式化歌词方法
function parseLyric (lrc) {
  const lyrics = lrc.split('\n')
  // [00:00.000] 作曲 : 林俊杰
  // 1.定义正则表达式提取[00:00.000]
  const reg1 = /\[\d*:\d*\.\d*\]/g
  // 2.定义正则表达式提取 [00
  const reg2 = /\[\d*/i
  // 3.定义正则表达式提取 :00
  const reg3 = /\:\d*/i
  // 4.定义对象保存处理好的歌词
  const lyricObj = {}
  lyrics.forEach(function (lyric) {
    // 1.提取时间
    let timeStr = lyric.match(reg1)
    if (!timeStr) { return }
    timeStr = timeStr[0]
    // 2.提取分钟
    const minStr = timeStr.match(reg2)[0].substr(1)
    // 3.提取秒钟
    const secondStr = timeStr.match(reg3)[0].substr(1)
    // 4.合并时间, 将分钟和秒钟都合并为秒钟
    const time = parseInt(minStr) * 60 + parseInt(secondStr)
    // 5.处理歌词
    const text = lyric.replace(reg1, '').trim()
    // 6.保存数据
    lyricObj[time] = text
  })
  return lyricObj
}
