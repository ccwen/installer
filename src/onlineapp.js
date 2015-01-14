var Reflux=require("reflux");
var store=require("./stores").online;
var actions=require("./actions");

var OnlineApp=React.createClass({
	mixins:[Reflux.listenTo(store,"onData")],
	getInitialState:function() {
		return {apps:[],message:"Getting List"};
	},
	onData:function(data){
		if (!data) {
			this.setState({message:"error fetching remote app list, check you network connection"});
		} else {
			this.setState({apps:data,message:""});
		}
	},
	showTitle:function() {
		if (!this.state.apps.length) return "Getting online app";
		return "Total "+this.state.apps.length+" books, Click To Download";
	},
	renderItem:function(item) {
		return <li>{item.title}</li>
	},
	downloadingmessage:function() {
		if(!this.state.apps.length) return <div>Getting list</div> 
		else return <div></div>
	},
	componentDidMount:function() {
		actions.fetchOnlineApp();
	},
	render:function() {
		return 	<div className="panel panel-warning">
		  		<div className="panel-heading">
		  		  <h3 className="panel-title">{this.showTitle()}</h3>
		  		</div>
		  		<div className="panel-body applist">
		  			{this.downloadingmessage()}
					{this.state.apps.map(this.renderItem)}
		  		</div>
			</div>
	}
});
module.exports=OnlineApp;

