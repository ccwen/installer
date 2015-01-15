/** @jsx React.DOM */

/* to rename the component, change name of ./component.js and  "dependencies" section of ../../component.js */

var liveupdate=require("ksana2015-webruntime").liveupdate; 

var Downloader = React.createClass({
	getInitialState: function() {
		return {downloading:false,downloadedByte:0};
	},
	propTypes:{
		action:React.PropTypes.func.isRequired
	},
	totalDownloadByte:function() {
		//app to be updated has newfilesize
		//new app only has filesizes
		var filesizes=this.props.app.newfilesizes || this.props.app.filesizes;
		var total=filesizes.reduce(function(p,c){return p+c},0);
		return total;
	},
	humanSize:function() {
		return liveupdate.humanFileSize(this.totalDownloadByte(),true);
	},
	humanDate:function() {
		return liveupdate.humanDate(this.props.app.date);
	},
	remainHumanSize:function() {
		var remain=this.totalDownloadByte()-this.state.downloadedByte;
		return liveupdate.humanFileSize(remain,true);
	},
	backFromDownload:function() {
		this.props.action("cancelDownload");
	},
	updateStatus:function() {
		var status=liveupdate.status();
		var files=this.props.app.newfiles || this.props.app.files;
		this.setState({nfile:status.nfile, filename: files[status.nfile], downloadedByte :status.downloadedByte });
		if (status.done) {
			clearInterval(this.timer1);
			this.setState({downloading:false,done:status.done});
		}
	},
	startDownload:function() {
		this.starttime=new Date();
		liveupdate.start( this.props.app, function(success){
			if (success) {
			this.setState({downloading:true});
			this.timer1=setInterval(this.updateStatus.bind(this), 1000);
			}
		},this);
	},
	cancelDownload:function() {
		clearInterval(this.timer1);
		liveupdate.cancel();
		this.setState({downloading:false});
	},
	renderDownloading:function() {
		var percent= Math.floor(100*(this.state.downloadedByte  / this.totalDownloadByte() ));
		var elapse=((new Date() - this.starttime)+1)/1000;
		var speed= (this.state.downloadedByte/ elapse)  ; //bytes per millisecond
		var bps=liveupdate.humanFileSize(speed,true);
		var remain=this.totalDownloadByte()-this.state.downloadedByte;
		var remaintime= Math.round((remain / speed));
		return (
		<div>
			<div className="col-sm-offset-2 col-sm-8">
				<div>Downloading {this.props.app.title}<br/></div>
				<div className="progress">
				<div className="progress-bar" style={{"width": percent+"%"}}>{percent}%</div>
				</div>
				<div>Remaining bytes: {this.remainHumanSize()}</div>
				<div>Speed: {bps} per second</div>
				<div>Remaining time: {remaintime} seconds<br/><hr/></div>
			</div>
			<div>
				<div className="col-sm-offset-4 col-sm-4">
				<a onClick={this.cancelDownload} className="btn btn-danger center-block">Cancel Download</a>
				</div>
			</div>
		</div>
		);
	},
	candownload:function() {
		if (typeof ksanagap.runtime=="string") return true;//old format
		
		var tooold= (this.props.app.minruntime && this.props.app.minruntime>ksanagap.runtime_version);
		if (tooold) return <span>Accelon version too old, please update</span> ;
		else return <a onClick={this.startDownload} className="center-block btn btn-primary btn-lg">Download</a> ;
	},  
	renderAsking:function() {
		return (
			<div>
			<a onClick={this.backFromDownload} className="btn btn-warning">Back</a><br/>
			{this.props.app.title} ({this.props.app.dbid})<br/>
			Build Date:{this.humanDate()}<br/>
			Description: {this.props.app.description}<br/>
			Download Size: <span>{this.humanSize()}</span><br/>
			<div>
				<div>
					<div className="col-sm-offset-4 col-sm-4">{this.candownload()}</div>
				</div>
			</div>
			
			</div>
		);
	},
	openapp:function() {
		ksanagap.switchApp(this.props.app.dbid);
	},
	renderDone:function() {
		return (
			<div>
			<a onClick={this.backFromDownload} className="btn btn-warning">Back</a><br/>

			<div>Download Completed {this.props.app.title}</div>
			<div>Status : {this.state.done} </div>
			<div className="col-sm-offset-4 col-sm-4">
				<a onClick={this.openapp} className="btn btn-success btn-lg center-block">Open {this.props.app.dbid}</a><br/>
			</div>
			</div>
		);
	},
	render: function() {
		if (this.state.done) {
			return this.renderDone();
		} else if (this.state.downloading) {
			return this.renderDownloading();
		} else {
			return this.renderAsking();
		}
	}
});
module.exports=Downloader;