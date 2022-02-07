var app = new Vue({
    el: "#app",
    data: {
        query: "",
        musicList: [],
        musicUrl: "",
        musicCover: "",
        musicCoverName: ""
    },
    methods: {
        searchMusic: function() {
            var tmp = this;
            axios.get("https://music-api.heheda.top/search?keywords=" + this.query).then(
                function(response) {
                    //console.log(response);
                    tmp.musicList = response.data.result.songs;
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
        playMusic: function(musicId) {
            //this.musicUrl = "https://music.163.com/song/media/outer/url?id=" + musicId + ".mp3";
            var tmp = this;
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