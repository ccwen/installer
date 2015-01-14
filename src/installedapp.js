var Reflux=require("reflux");
var actions=require("./actions");
var store=require("./stores").installed;
var updatables=require("./stores").updatables;
var Banner=require("./banner");
var InstalledApp=React.createClass({
	getInitialState:function(){
		return {installed:[], selected:0, image:"banner.png"}
	},
	mixins:[Reflux.listenTo(store,"onData"),Reflux.listenTo(updatables,"onUpdatablesChanged")],
	onData:function(installed) {
		this.setState({installed:installed});
		if (installed&&installed.length) setTimeout(actions.checkHasUpdate,3000);
	},
	select:function(e) {
		var target=e.target;
		while (target && target.nodeName!="TR")target=target.parentElement;
		this.setState({selected:target.dataset.i,deletable:false,showextra:false});
		var dbid=this.state.installed[target.dataset.i].dbid;
		this.setState({image:"../"+dbid+"/banner.png",dbid:dbid});
		clearTimeout(this.timer);
		this.timer=setTimeout(this.showExtraInfo,5000);
		
	},
	showExtraInfo:function() {
		//if (ksana.platform=="ios" || ksana.platform=="android") {
		this.setState({deletable:true,showextra:true});
	},
	componentDidMount:function() {
		actions.fetchInstalledApp();
	},
	askDownload:function() {

	},
	deleteApp:function() {

	},
	onUpdatablesChanged:function(updatables) {
		this.setState({installed:updatables});
	},
	renderUpdateButton:function(item,idx) {
		if (item.hasUpdate) {
			return <a data-n={idx} onClick={this.askDownload} className="btn btn-warning">Update</a>
		}
	},
	renderDeleteButton:function(item,idx) {
		if (idx==this.state.selected && this.state.deletable && item.path!="installer") {
			return <a data-path={item.path} onClick={this.deleteApp} className="btn btn-danger pull-right">Uninstall</a>
		}
	},
	renderCaption:function(item,idx) {
		if (idx==this.state.selected) {
			return <button title={item.version +"-"+ item.build} className="appbtn btn btn-primary" data-path={item.path} onClick={this.opendb}>{item.title}</button>
		} else { 
			//https://github.com/facebook/react/issues/134
			return <a href="#" onClick={this.select}>{item.title}</a>
		}
	},
	renderItem:function(item,idx) {
		var classes="";
		if (item.path=="installer" && !item.hasUpdate) return <div></div>;
		if (idx==this.state.selected) classes="info";
		return (<tr data-i={idx}  onClick={this.select} key={"i"+idx} className={classes} >
			<td>{this.renderCaption(item,idx)} {this.renderUpdateButton(item,idx)}</td>
			<td>{this.renderDeleteButton(item,idx)}</td>
		</tr>);
	},
	showTitle:function() {
		if (!this.state.installed.length) return "Installed Books";
		return "Select and click button to open.";
	},
	renderAccelon:function() {
	//if (this.state.installed && this.state.installed.length<2)  
		return ( <footer className="footer accelon text-center"><br/><br/><hr/>
	  	Powered by <a onClick={this.goWebsite} href="#">Accelon</a>, Ksanaforge 2014 
	  	</footer> );
	//else return <span></span>;
	},
	goWebsite:function() {
		window.open("http://accelon.github.io");
	},
	render:function() { 
		return <div className="panel panel-primary">
		  <Banner image={this.state.image}/>
		  <div className="panel-heading">
		    <h3 className="panel-title">{this.showTitle()}</h3>
		  </div>
		  <div className="panel-body installedapplist">
			<table className="table installed">
				<tbody>
				{this.state.installed.map(this.renderItem)}
				</tbody>
			</table>
			{this.renderAccelon()}
		  </div>
		</div>
	}
	
});
module.exports=InstalledApp;
