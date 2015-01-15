var Reflux=require("reflux");
var actions=require("./actions");
var store=require("./stores").rawgit;
var liveupdate=require("ksana2015-webruntime").liveupdate;
var RawgitApp=React.createClass({
	mixins:[Reflux.listenTo(store,"onData")],
	getInitialState:function() {
		var repouser=localStorage.getItem("repouser") || "ksanaforge";
		var reponame=localStorage.getItem("reponame") || "nanchuan";
		return {ksanajs:null,repouser:repouser,reponame:reponame,message:""};
	},
	propTypes:{
		action:React.PropTypes.func.isRequired
	},
	onData:function(ksanajs) {
		
		if (ksanajs) {
			this.setState({ksanajs:ksanajs});	
		} else {
			this.setState({ksanajs:null,message:"Invalid Repository."});
		}
	},
	getksanajs:function() {
		var repouser=this.refs.repouser.getDOMNode().value;
		var reponame=this.refs.reponame.getDOMNode().value;
		this.setState({message:"fetching info"});
		actions.fetchRawgit(repouser,reponame);
	},
	download:function() {
		this.props.action("startDownload",this.state.ksanajs);
	},
	appinfo:function() {
		if (!this.state.ksanajs) return <div>
			{this.state.message}
		</div>

		var ksana=this.state.ksanajs;
		if (!ksana || !ksana.filesizes)  return <div>Error ksana.js</div>
		var totalsize=ksana.filesizes.reduce(function(i,acc){return acc+i},0);
		return <div>
				<table className="table ksanainfo">
					<tr><td>ID</td><td>{ksana.dbid}</td></tr>
					<tr><td>Title</td><td>{ksana.title} </td></tr>
					<tr><td>Date</td><td>{liveupdate.humanDate(ksana.date)} </td></tr>
					<tr><td>Size</td><td>{liveupdate.humanFileSize(totalsize,true)}</td></tr>
				</table>
				<div>
			<button onClick={this.download} className="input center-block btn btn-large btn-warning">Install</button><br/>
			</div>
		</div>
	},
	render:function() {
		return <div className="panel panel-warning">
			<div className="panel-heading">
				<h3 className="panel-title">Install from Github</h3>
			</div>
			<div className="panel-body applist">
			Owner:
			<input className="input form-control" ref="repouser" defaultValue={this.state.repouser}/>
			Repository Name:
			<input className="input form-control" ref="reponame" defaultValue={this.state.reponame}/>
			<div>
				<button onClick={this.getksanajs} 
				className="input btn btn-large btn-primary center-block">Get Info</button>
			</div>
			{this.appinfo()}
			</div>
			
		</div>	
	}
	
});
module.exports=RawgitApp;