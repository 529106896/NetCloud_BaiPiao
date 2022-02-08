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
        currentIndex: -1
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
            )
        }
    }
})