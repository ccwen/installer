
var E=React.createElement;
var Swipe=require("ksana2015-swipe");
var InstalledApp=require("./installedapp");
var OnlineApp=require("./onlineapp");
var RawgitApp=require("./rawgitapp");
var Downloader=require("./downloader");
var maincomponent = React.createClass({
  getInitialState:function() {
  	return {downloading:false};
  },
  renderMobile:function() {
     return (
      E("div", {className: "main"}, 
        E(Swipe, {ref: "Swipe", continuous: true, 
               transitionEnd: this.onTransitionEnd, 
               swipeStart: this.onSwipeStart, swipeEnd: this.onSwipeEnd}, 
        E("div", {className: "swipediv"}, 
          <InstalledApp action={this.action}/>
        ), 
        E("div", {className: "swipediv"}, 
          <OnlineApp action={this.action} />
        ), 
        E("div", {className: "swipediv"}, 
          <RawgitApp action={this.action}/>
        )
        )
      )
      );
  },
  renderPC:function() {
    return E("div", {className: "main"}, 
        E("div", {className: "swipediv col-md-4"}, 
          <InstalledApp action={this.action}/>
        ), 
        E("div", {className: "swipediv col-md-4"}, 
          <OnlineApp action={this.action}/>
        ), 
        E("div", {className: "swipediv col-md-4"}, 
          <RawgitApp action={this.action}/>
        )
      )
  },
  renderList:function() {
      if (ksanagap.platform=="chrome" || ksanagap.platform=="node-webkit") {
        return this.renderPC();
      } else {
        return this.renderMobile();
      }
  },
  action:function(type,app) {
    if (type=="startDownload") {
      this.setState({app:app,downloading:true});  
    } else if (type=="cancelDownload") {
      this.setState({app:null,downloading:false});
    }
  },
  render: function() {  //main render routine
    if (this.state.downloading) {
      return <div className="main">
          <Downloader app={this.state.app} action={this.action}/>
        </div>
    } else {
      return this.renderList();
    }
  }

});
module.exports=maincomponent;