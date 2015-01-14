
var E=React.createElement;
var Swipe=require("ksana2015-swipe");
var InstalledApp=require("./installedapp");
var OnlineApp=require("./onlineapp");
var RawgitApp=require("./rawgitapp");

var maincomponent = React.createClass({
  getInitialState:function() {
  	return {result:[]};
  },
  componentDidMount:function() {
  },
  renderMobile:function() {
     return (
      E("div", {className: "main"}, 
        E(Swipe, {ref: "Swipe", continuous: true, 
               transitionEnd: this.onTransitionEnd, 
               swipeStart: this.onSwipeStart, swipeEnd: this.onSwipeEnd}, 
        E("div", {className: "swipediv"}, 
          <InstalledApp/>
        ), 
        E("div", {className: "swipediv"}, 
          <OnlineApp/>
        ), 
        E("div", {className: "swipediv"}, 
          <RawgitApp/>
        )
        )
      )
      );
  },
  renderPC:function() {
    return E("div", {className: "main"}, 
        E("div", {className: "swipediv col-md-4"}, 
          <InstalledApp/>
        ), 
        E("div", {className: "swipediv col-md-4"}, 
          <OnlineApp/>
        ), 
        E("div", {className: "swipediv col-md-4"}, 
          <RawgitApp/>
        )
      )
  },
  render: function() {  //main render routine
      if (ksanagap.platform=="chrome" || ksanagap.platform=="node-webkit") {
        return this.renderPC();
      } else {
        return this.renderMobile();
      }
  }

});
module.exports=maincomponent;