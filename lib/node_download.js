function NodeDownloader() {
	
	var dirToSave = '/Users/downloads/';
	var spawn = require('child_process').spawn;
	var events = require('events');
	var dl;
	var lastProgress;
	
	var eventEmitter = new events.EventEmitter();
	
	// add the Trim function to javascript
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}	
	
	this.setDirToSave = function(dir) {
		dirToSave = dir;
	};
	
	this.getDirToSave = function() {
		return dirToSave;
	}
	
	this.downloadFile = function(file) {
		console.log(dirToSave)
		dl = spawn('wget', ['-P' + dirToSave, file]);
		
		dl.on('exit', function (code) {
		  console.log('child process exited with code ' + code);
		});
		
		dl.stderr.on('data', function (data) {
			
			data = data.toString('ascii');
			
			// extract the progress percentage
			var regExp = new RegExp('\\d{0,}%','i');	
			if(regExp.test(data)) {
				var progress = data.match(regExp);
				
				// call only when percentage changed
				if(lastProgress != progress[0]) {
					//console.log('progress: ' + progress[0]);
					
					lastProgress = progress[0];
					
					// extract the download speed
					var position = data.search(regExp);
					var speed = data.substr(position + progress[0].length).trim();
					speed = speed.substr(0, speed.indexOf('/s') + 2).trim();
					
					// call the event
					eventEmitter.emit('progress', progress, speed);
				}
			}
			
		});
		dl.stdin.end();
	}
	
	this.stopDownload = function() {
		console.log('download stopped');
		dl.kill();
	}
	
	// Expose the public API
	return {
		hello: this.hello,
		setDirToSave: this.setDirToSave,
		getDirToSave: this.getDirToSave,
		downloadFile: this.downloadFile,
		stopDownload: this.stopDownload,
		eventEmitter: eventEmitter
	};
	
}

exports.NodeDownloader = NodeDownloader;