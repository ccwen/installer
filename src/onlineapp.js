var Reflux=require("reflux");
var store=require("./stores").online;
var downloadable=require("./stores").downloadable;
var actions=require("./actions");
var liveupdate=require("ksana2015-webruntime").liveupdate;

var OnlineApp=React.createClass({
	mixins:[Reflux.listenTo(store,"onData"),Reflux.listenTo(downloadable,"onDownloadable")],
	propTypes:{
		action:React.PropTypes.func.isRequired
	},
	getInitialState:function() {
		return {apps:[],message:"Getting List",selected:-1,downloadable:false};
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
		return "Total "+this.state.apps.length+" books, Click To Install";
	},
	onDownloadable:function(ksanajs){
		this.setState({downloadable:true,ksanajs:ksanajs});
	},
	select:function(e) {
		var target=e.target;
		while (target && target.nodeName!="TR")target=target.parentElement;
		var i=parseInt(target.dataset.i);
		if (i==this.state.selected) return ;
		var app=this.state.apps[i];
		this.setState({selected:i,downloadable:false});
		actions.fetchKsanajs(app);
	},
	download:function(e) {
		console.log("start download",this.state.ksanajs);
    	this.props.action("startDownload",this.state.ksanajs);
	},
	renderInstallButton:function(item,idx) {
		if (idx==this.state.selected) {
			if (this.state.downloadable) {
				var ksanajs=this.state.ksanajs;
				if (!ksanajs || !ksanajs.filesizes) return null;
				var totalsize=ksanajs.filesizes.reduce(function(i,acc){return acc+i},0);
				return <div>
				<a data-n={idx} onClick={this.download} className="btn btn-warning pull-right">Install</a>
				{" "+liveupdate.humanFileSize(totalsize,true)}
				</div>
			} else {
				return <span> fetching info</span>
			}
		}else return null;
	},
	renderItem:function(item,idx) {
		var classes="installedtr";
		if (idx==this.state.selected) classes+=" info";
		return (<tr data-i={idx}  onClick={this.select} key={"i"+idx} className={classes} >
			<td><a href="#" onClick={this.select}>{item.title}</a>{this.renderInstallButton(item,idx)}</td>
		</tr>);
	},
	downloadingmessage:function() {
		if(!this.state.apps.length) return <div>Getting list</div> 
		else return <div></div>
	},
	componentDidMount:function() {
		actions.fetchOnlineApp();
	},
	render:function() {
		return 	<div className="panel panel-success">
		  		<div className="panel-heading">
		  		  <h3 className="panel-title">{this.showTitle()}</h3>
		  		</div>
		  		<div className="panel-body applist">
		  			{this.downloadingmessage()}
		  			<table className="table downloadable">
		  			<tbody>
					{this.state.apps.map(this.renderItem)}
					</tbody>
					</table>
		  		</div>
			</div>
	}
});
module.exports=OnlineApp;

