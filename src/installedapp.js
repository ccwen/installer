var Reflux=require("reflux");
var actions=require("./actions");
var store=require("./stores").installed;
var InstalledApp=React.createClass({
	getInitialState:function(){
		return {installed:[]}
	},
	mixins:[Reflux.listenTo(store,"onData")],
	onData:function(installed) {
		this.setState({installed:installed});
	},
	componentDidMount:function() {
		actions.fetchInstalledApp();
	},
	renderItem:function(item) {
		return <li>{item.title}</li>
	},
	showTitle:function() {
		if (!this.state.installed.length) return "Installed Books";
		return "Total "+this.state.installed.length+" books, Click To Open";
	},
	render:function() {
		return <div className="panel panel-success">
		  <div className="panel-heading">
		    <h3 className="panel-title">{this.showTitle()}</h3>
		  </div>
		  <div className="panel-body applist">
			<ul>
				{this.state.installed.map(this.renderItem)}
			</ul>
		  </div>
		</div>
	}
	
});
module.exports=InstalledApp;
