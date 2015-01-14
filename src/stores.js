var Reflux=require("reflux");
var actions=require("./actions");
var liveupdate=require("ksana2015-webruntime").liveupdate;
var remoteapplistjs="http://accelon.github.io/applist.js";
var downloaded_apps=[];
var findAppById=function(id) {
  var r=apps.filter(function(app) { return app.dbid==id}  );
  if (r.length) return r[0];
}

var store_installed=Reflux.createStore({
	listenables: actions,
	onFetchInstalledApp:function() {
      downloaded_apps=JSON.parse(kfs.listApps());
      this.trigger(downloaded_apps);
	}
});

var store_online=Reflux.createStore({
	listenables: actions,
	onFetchOnlineApp:function() {
		var that=this;
		console.log("jsonp",remoteapplistjs);
		liveupdate.jsonp(remoteapplistjs,function(data){
			this.trigger(data);
		},this);
	},
});
var store_updatables = Reflux.createStore({
    listenables: actions,
    onCheckHasUpdate:function() {

      liveupdate.getUpdatables(downloaded_apps,function(updatables){
        for (var i=0;i<updatables.length;i++) {
          var app=findAppById(updatables[i].dbid);
          app.hasUpdate=true;
          app.newfiles=updatables[i].newfiles;
        }
        this.trigger(downloaded_apps);
      },this);
    }
})
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

var store_downloadable=Reflux.createStore({
	listenables: [actions],
	onFetchKsanajs:function(remoteapp) {
		var url=remoteapp.url+"/ksana.js";
		liveupdate.jsonp(url,remoteapp.appid,function(data){
			this.trigger(data);
		},this);
	}	
})

module.exports={installed:store_installed, online:store_online, 
	rawgit:store_rawgit,updatables:store_updatables,downloadable:store_downloadable};