var Reflux=require("reflux");
var actions=require("./actions");
var store=require("./stores").installed;
var updatables=require("./stores").updatables;
var Banner=require("./banner");
var InstalledApp=React.createClass({
	getInitialState:function(){
		return {installed:[], message:"",selected:0, image:"banner.png",ready:false}
	},
	mixins:[Reflux.listenTo(store,"onData"),Reflux.listenTo(updatables,"onUpdatablesChanged")],
	onData:function(installed) {
		this.setState({installed:installed,ready:true});

		if (installed&&installed.length) setTimeout(actions.checkHasUpdate,10000);
	},
	propTypes:{
		action:React.PropTypes.func.isRequired
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
	deleteApp:function(e) {
		var path=e.target.dataset['path'];
		if (path && path!="installer") {
			console.log("delete app",path);
			if (kfs&&kfs.deleteApp){
				kfs.deleteApp(path);
				this.deleting=true;
				setTimeout(function(){
					actions.fetchInstalledApp();
					this.deleting=false;
				},2000);
			} 
		}
	},
	opendb:function(e) {
		if (this.deleting) return;
		this.setState({deletable:false});
		var path=e.target.dataset['path'];
		ksanagap.switchApp(path);
	},
	onUpdatablesChanged:function(updatables) {
		this.setState({installed:updatables});
	},
	download:function(e) {
		var n=e.target.dataset['n'];
		var ksanajs=this.state.installed[n];
		this.props.action("startDownload",ksanajs);
	},
	renderUpdateButton:function(item,idx) {
		if (item.hasUpdate) {
			return <a data-n={idx} onClick={this.download} className="btn btn-warning">Update</a>
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
		var classes="installedtr";
		if (item.path=="installer" && !item.hasUpdate) return <div></div>;
		if (idx==this.state.selected) classes+=" info";
		return (<tr data-i={idx}  onClick={this.select} key={"i"+idx} className={classes} >
			<td>{this.renderCaption(item,idx)} {this.renderUpdateButton(item,idx)}</td>
			<td>{this.renderDeleteButton(item,idx)}</td>
		</tr>);
	},
	showTitle:function() {
		if (!this.state.installed.length) return "Swipe right to install book.";
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
	renderWelcome:function() {
		if (!this.state.installed.length && this.state.ready) {
			return <div>
			<img className="swiperight" src="swiperight.png"/>
			</div>			
		} return null;
	},
	render:function() { 
		return <div className="panel panel-info">
		  <Banner image={this.state.image}/>
		  <div className="panel-heading">
		    <h3 className="panel-title">{this.showTitle()}</h3>
		  </div>
		  <div className="panel-body installedapplist">
		  	{this.renderWelcome()}
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
