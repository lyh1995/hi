import Vue from 'vue'
import axios from 'axios';
import VueAxios from 'vue-axios';
import Vuex from 'vuex'


Vue.use(VueAxios, axios);

Vue.use(Vuex);



export const store= new Vuex.Store({
	state: {
		isShowHead: true,//控制header是否显示
		isMyListShow: false,//控制'创建的歌单'是否显示
		isShowFooter: true,//控制播放器是否显示
		isPlaying: false,
		testData:'',
		headIcon: [{
			imgUrl: "url('/static/asideList.svg')",
			leftStyle: "0%"
		}, {
			imgUrl: "url('/static/music.svg')",
			leftStyle: "30.4%"
		}, {
			imgUrl: "url('/static/wangyiyun.svg')",
			leftStyle: "42.4%"
		}, {
			imgUrl: "url('/static/found.svg')",
			leftStyle: "54.7%"
		}, {
			imgUrl: "url('/static/search.svg')",
			leftStyle: "85.9%"
		}],
		playerHeadIcon: [{
			imgUrl: "url('/static/goback.svg')",
			leftStyle: "0%"
		}, {
			imgUrl: "url('/static/share.svg')",
			leftStyle: "85.9%"
		}],
		listData: [{
			icon: "url('/static/localMusic.svg')",
			listName: "本地音乐"
	    }, {
			icon: "url('/static/recentPlayed.svg')",
			listName: "最近播放"
	    }, {
	    	icon: "url('/static/download.svg')",
			listName: "下载管理"
	    }, {
			icon: "url('/static/myRadio.svg')",
			listName: "我的电台"
	    }, {
			icon: "url('/static/myCollection.svg')",
			listName: "我的收藏"
	    }],
		initialTabData: "url('/static/tabDown.svg')",//创建歌单的icon
		musicListCreated: [{
			name: "reputation",
			imgUrl: "/static/reputation.jpg",
			songNum: "15"
		}, {
			name: "1989",
			imgUrl: "/static/1989.jpg",
			songNum: "19"
		}, {
			name: "red",
			imgUrl: "/static/red.jpg",
			songNum: "22"
		}],
		musicPlayedNow: {
			songName: 'Getaway Car',
			songImg: '/static/reputation.jpg',
			singer: 'Taylor Swift',
			lyric: 'Taylor Swift - Reputation',
			song: '/static/Taylor Swift - Getaway Car.mp3'
		},
		skinColor: "#D43C31",//"#C20C0C",
		footerColor: "#FFFFFF",
		tabColor: "#F0F4F3",
		playerBack: "#6E6E6E",
		playState: "url('/static/play.svg')",
		playMode: "loop",
		lrcData: [],
		strix: 0,
		songStartTime: 0.2
	},
	mutations: {
		toogleTab (state) {
			if (state.initialTabData == "url('/static/tabDown.svg')") {
				state.initialTabData = "url('/static/tabUp.svg')";
				state.isMyListShow = true;
			} else {
				state.initialTabData = "url('/static/tabDown.svg')";
				state.isMyListShow = false;
			}
		},//切换'创建的歌单'下拉页
		toogleSettings (state) {
			console.log('hi');
		},
		tooglePlayState (state) {
			console.log('111');
			if (state.playState == "url('/static/pause.svg')") {
				state.playState = "url('/static/play.svg')";
				state.isPlaying = false;
			} else {
				state.playState = "url('/static/pause.svg')";
				state.isPlaying = true;
			}
		},//切换播放状态
		songTimeChange (state, time) {
			if (time <= state.songStartTime) {
				state.strix = 0;
				state.musicPlayedNow.lyric = state.lrcData[0].text;
			} else if (state.strix < state.lrcData.length - 1) {
				if (time > state.lrcData[state.strix+1].time) {
					state.strix++;
					state.musicPlayedNow.lyric = state.lrcData[state.strix].text;
          }
			}
		}
	},
	getters: {

	},
	actions: {
	    getLrc({ commit,state }) {
	      return new Promise((resolve, reject) => {
	        Vue.axios.get('/api/lryic')
	            .then (res => {
	            	console.log(res);
	              if (res.data.errno === 0) {
	                let dataOfLrc = res.data.lrcData.split("<br/>");
	                let dataLrc = [];
	                for (let i in dataOfLrc) {
	                	let timeMatch = dataOfLrc[i].match(/\[(\d+:\d+\.\d+)\]/);
	                	timeMatch = timeMatch[1];
	                	console.log(timeMatch);
	                	let minutes = parseInt(timeMatch.slice(0, timeMatch.indexOf(':')));
	                	let seconds = parseFloat(timeMatch.substr(timeMatch.indexOf(':')+1));
	                	let newTime = (minutes*60 + seconds).toFixed(2);
	                	console.log(newTime);
	                	dataLrc.push({
	                		time: newTime,
              				text: dataOfLrc[i].replace(/^.+?\]/, '')
	                	})
	                }
	                state.lrcData = dataLrc;
	                localStorage.lrcData = JSON.stringify(state.lrcData);
	                console.log('lrcdata');
	                console.log(state.lrcData);
	              }
	            })
	            .then(() => {
	            });
	        resolve();
	      });
	    },
	    getTestData({ commit,state }) {
	    	return new Promise((resolve, reject) => {
	        Vue.axios.get('/api/test-data')
	            .then (res => {
	            	state.testData = res;
	            })
	            .then(() => {
	            });
	        resolve();
	      });
	    }
	}

})