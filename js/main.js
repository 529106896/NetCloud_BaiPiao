var app = new Vue({
    el: "#app",
    data: {
        query: "",
        musicList: [],
        musicUrl: "",
        musicCover: "",
        musicCoverName: "",
        searchHasMore: false,
        searchMaxPage: 0,
        currentPage: 0,
        currentOffSet: 0,
        searchResultCount: 0,
        currentIndex: -1,
        lyricObjArr: [],
        currentLyricIndex: -1
    },
    methods: {
        searchMusic: function() {
            var tmp = this;
            if (tmp.query == "") {
                alert("不能输入空字符串！");
                tmp.musicList = [];
                //return;
            }
            axios.get("https://music-api.heheda.top/search?limit=10&keywords=" + this.query).then(
                function(response) {
                    //console.log(response);
                    if (response.data.result.songCount == 0) {
                        alert("无查询结果！");
                        tmp.musicList = [];
                    } else {
                        tmp.musicList = response.data.result.songs;
                        tmp.searchMaxPage = Math.ceil(response.data.result.songCount/10);
                        tmp.searchResultCount = response.data.result.songCount;
                        //console.log(tmp.searchMaxPage);
                    }
                    if (response.data.result.hasMore == true) {
                        tmp.searchHasMore = true;
                    } else {
                        tmp.searchHasMore = false;
                    }
                    tmp.musicUrl = "";
                    tmp.musicCover = "";
                    tmp.musicCoverName = "";
                    tmp.currentIndex = -1;
                    tmp.lyricObjArr = [];
                    tmp.currentLyricIndex = -1;
                    //console.log(tmp.musicList);
                },
                function(err) {
                    console.log(err);
                }
            )
        },
        prevPage: function() {
            var tmp = this;
            tmp.currentOffSet -= 10;
            axios.get("https://music-api.heheda.top/search?limit=10&keywords=" + tmp.query + "&offset=" + tmp.currentOffSet).then(
                function(response) {
                    //console.log(tmp.pageOffSet);
                    tmp.currentPage--;
                    //console.log(tmp.currentPage);
                    //console.log(response);
                    tmp.musicList = response.data.result.songs;
                },
                function(err) {
                    console.log(err);
                }
            )
        },
        nextPage: function() {
            var tmp = this;
            tmp.currentOffSet += 10;
            axios.get("https://music-api.heheda.top/search?limit=10&keywords=" + tmp.query + "&offset=" + tmp.currentOffSet).then(
                function(response) {
                    //console.log(tmp.pageOffSet);
                    tmp.currentPage++;
                    //console.log(tmp.currentPage);
                    tmp.musicList = response.data.result.songs;
                },
                function(err) {
                    console.log(err);
                }
            )
        },
        formatLyricTime: function(time) {
            const regMin = /.*:/;
            const regSec = /:.*\./;
            const regMs = /\./;

            const min = parseInt(time.match(regMin)[0].slice(0, 2));
            let sec = parseInt(time.match(regSec)[0].slice(1, 3));
            const ms = time.slice(time.match(regMs).index + 1, time.match(regMs).index + 3);
            if (min !== 0) {
                sec += min * 60
            }
            return Number(sec + '.' + ms);
        },
        playMusic: function(musicId, index) {
            //this.musicUrl = "https://music.163.com/song/media/outer/url?id=" + musicId + ".mp3";
            var tmp = this;
            tmp.currentIndex = index;
            axios.get("https://music-api.heheda.top/song/url?id=" + musicId).then(
                function(response) {
                    //console.log(response);
                    tmp.musicUrl = response.data.data[0].url;
                    if (tmp.musicUrl == null) {
                        tmp.musicUrl = "https://music.163.com/song/media/outer/url?id=" + musicId + ".mp3";
                    }
                    //console.log(tmp.musicUrl);
                },
                function(err) {
                    console.log(err);
                }
            );
            axios.get("https://music-api.heheda.top/song/detail?ids=" + musicId).then(
                function(response) {
                    //console.log(response);
                    tmp.musicCover = response.data.songs[0].al.picUrl;
                    tmp.musicCoverName = response.data.songs[0].name;
                    //console.log(tmp.musicCover);
                },
                function(err) {
                    console.log(err);
                }
            );
            axios.get("https://music-api.heheda.top/lyric?id=" + musicId).then(
                function(response) {
                    //console.log(response);
                    const lineArr = response.data.lrc.lyric.split(/\n/);
                    //console.log(lineArr);
                    const regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
                    lineArr.forEach(item => {
                        if (item == '') return;
                        const obj = {};
                        const time = item.match(regTime);

                        obj.lyric = item.split(']')[1].trim() === '' ? '' : item.split(']')[1].trim();
                        obj.time = time ? tmp.formatLyricTime(time[0].slice(1, time[0].length - 1)) : 0;
                        obj.uid = Math.random().toString().slice(-6);
                        //console.log(obj);
                        if (obj.lyric == '') {
                            console.log('这一行没有歌词');
                        } else {
                            tmp.lyricObjArr.push(obj);
                        }
                    });

                },
                function(err) {
                    console.log(err);
                }
            )
        },
        changeLyric: function() {
            const curr = document.querySelector("audio").currentTime;
            //console.log(curr);
            //console.log(this.lyricObjArr);
            for(let tmp = this.lyricObjArr.length - 1; tmp >= 0; tmp--) {
                if (curr > parseInt(this.lyricObjArr[tmp].time)) {
                    //const index = this.$refs.lyric[tmp].dataset.index;
                    //console.log(tmp);
                    //console.log(this.lyricObjArr[tmp].lyric);
                    this.currentLyricIndex = tmp;
                    break;
                    //console.log(this.lyricObjArr[tmp].lyric);
                }
            }
        }
    }
})