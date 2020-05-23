// 这个JS文件就是专门用于管理请求各种接口地址的
import Network from './network'
export const getBanner = () => Network.get('banner?type=2')
export const getPersonalized = () => Network.get('personalized?limit=6')
export const getNewAlbum = () => Network.get('album/newest')
export const getNewSong = () => Network.get('personalized/newsong')
export const getPlayList = (data) => Network.get('/playlist/detail', data)
export const getAlbum = (data) => Network.get('album', data)
export const getSongDetail = (data) => Network.get('song/detail', data)
export const getSongLyric = (data) => Network.get('lyric', data)
export const getSongURL = (data) => Network.get('song/url', data)
export const getAritstsSongs = (data) => Network.get('artists', data)
// 单独获取热门的5位歌手 热门歌手 接口地址 : /top/artists
export const getHotArtists = () => {
  // 返回的数据result.artists才是想要的继续处理下
  return new Promise(function (resolve, reject) {
    Network.get('top/artists?offset=0&limit=5')
      .then(function (result) {
        resolve(result.artists)
      }).catch(function (err) {
        reject(err)
      })
  })
}
// 分别按字母获取30条歌手
// type 1男歌手 2女歌手 3乐队  area 取值: 7华语  96欧美
// initial: 按首字母索引查找参数  Letter 字母，信
export const getLetterArtists = (letter) => {
  return new Promise(function (resolve, reject) {
    const letterArtists = []
    Network.all([
      Network.get(`artist/list?offset=0&limit=5&type=1&area=7&initial=${letter}`),
      Network.get(`artist/list?offset=0&limit=5&type=2&area=7&initial=${letter}`),
      Network.get(`artist/list?offset=0&limit=5&type=3&area=7&initial=${letter}`),
      Network.get(`artist/list?offset=0&limit=5&type=1&area=96&initial=${letter}`),
      Network.get(`artist/list?offset=0&limit=5&type=2&area=96&initial=${letter}`),
      Network.get(`artist/list?offset=0&limit=5&type=3&area=96&initial=${letter}`)
    ])
      .then(function (result) {
        // console.log(result)
        result.forEach(function (item) {
          // 解构每个item里的6个artists
          letterArtists.push(...item.artists)
        })
        // console.log(letterArtists)
        resolve(letterArtists)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}
// 返回一个对象，对象的keys包含字母数组，对象的list包含所有歌手数据
export const getAllArtists = (letter) => {
  return new Promise(function (resolve, reject) {
    const keys = ['热']
    const list = [getHotArtists()]
    // 将keycode数字转化为字母
    for (let i = 65; i < 91; i++) {
      const char = String.fromCharCode(i)
      // 将字母存入keys
      keys.push(char)
      // 将根据字母查找的歌手信息存入list
      list.push(getLetterArtists(char))
    }
    Network.all(list)
      .then(function (result) {
        const obj = {}
        // 给对象keys绑定字母key的数组，list绑定所有请求到的歌手数据
        obj.keys = keys
        obj.list = result
        // console.log(obj)
        resolve(obj)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}
export const getTopListDetail = () => {
  return new Promise(function (resolve, reject) {
    // category 类别，种类;
    const category = {
      officialList: [
        { name: '云音乐飙升榜', id: 3 },
        { name: '云音乐新歌榜', id: 0 },
        { name: '网易原创歌曲榜', id: 2 },
        { name: '云音乐热歌榜', id: 1 }
      ],
      recList: [
        { name: '云音乐说唱榜', id: 23 },
        { name: '云音乐电音榜', id: 25 },
        { name: '云音乐欧美新歌榜', id: 32 },
        { name: '抖音排行榜', id: 26 },
        { name: '云音乐ACG音乐榜', id: 22 },
        { name: '云音乐古典音乐榜', id: 24 }
      ],
      globalList: [
        { name: '美国Billboard周榜', id: 6 },
        { name: 'UK排行榜周榜', id: 5 },
        { name: 'Beatport全球电子舞曲榜', id: 21 },
        { name: '日本Oricon周榜', id: 10 },
        { name: 'iTunes榜', id: 8 },
        { name: '英国Q杂志中文版周榜', id: 29 }
      ],
      otherList: [
        { name: 'KTV唛榜', id: 7 },
        { name: '法国 NRJ Vos Hits 周榜', id: 19 },
        { name: '新声榜', id: 27 },
        { name: '云音乐韩语榜', id: 28 },
        { name: '电竞音乐榜', id: 30 },
        { name: '云音乐欧美热歌榜', id: 31 }
      ],
      // 少了个s
      titles: { officialList: '官方榜', recList: '推荐榜', globalList: '全球榜', otherList: '更多榜单' }
    }
    // 所有榜单内容摘要接口地址 : /toplist/detail 获取所有榜单摘要的对象
    Network.get('toplist/detail')
      .then(function (data) {
        data.list.forEach(function (obj) {
          let flag = false
          // for…of遍历出的结果是value
          // for…in遍历出的结果是key
          for (const key in category) {
            for (let i = 0; i < category[key].length; i++) {
              if (category[key][i].name === obj.name) {
                category[key][i].rank = obj
                flag = true
                break
              }
            }
            // 找到榜单对应的数据后结束循环，根据foreEach下个obj继续选择赋rank值
            if (flag) {
              break
            }
          }
        })
        resolve(category)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}
// 对应排行榜的数据请求  接口地址 : /top/list 传入数字 idx, 可获取不同排行榜 调用例子 : /top/list?idx=6
export const getTopList = (data) => Network.get('/top/list', data)
// 搜索type=1单曲
export const getSearchList = (data) => Network.get('search?type=1', data)
// 热搜列表(简略)
export const getSearchHot = () => Network.get('/search/hot')
