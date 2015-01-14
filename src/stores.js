var Reflux=require("reflux");
var actions=require("./actions");
var liveupdate=require("ksana2015-webruntime").liveupdate;
var remoteapplistjs="http://accelon.github.io/applist.js";
var store_installed=Reflux.createStore({
	listenables: [actions],
	onFetchInstalledApp:function() {
      var apps=JSON.parse(kfs.listApps());
      this.trigger(apps);
	}
});

var store_online=Reflux.createStore({
	listenables: [actions],
	onFetchOnlineApp:function() {
		var that=this;
		console.log("jsonp",remoteapplistjs);
		liveupdate.jsonp(remoteapplistjs,function(data){
			console.log(data);
			this.trigger(data);
		},this);
	},
});

var store_rawgit=Reflux.createStore({
	listenables: [actions],
	onFetchRawgit:function(repouser,reponame) {
		var url="http://rawgit.com/"+repouser+"/"+reponame+"/master/ksana.js";
		var that=this;
		liveupdate.jsonp(url,reponame,function(data){
			console.log("trigger",data)
			this.trigger(data);
		},this);
	}
});

module.exports={installed:store_installed, online:store_online, rawgit:store_rawgit};