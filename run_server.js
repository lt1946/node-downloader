var http = require('http');
var nodeDownloader = require('./lib/node_download.js');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});

	var url = require('url').parse(req.url, true);
 
	res.write(url.query.file);

	var download = new nodeDownloader.NodeDownloader();

	download.setDirToSave('/Users/borelli/Projetos/Web/node.js/downloads/');
	download.downloadFile(url.query.file);
	
	download.eventEmitter.on('progress', function(percent, speed) {
		console.log('percent: ' + percent);
		console.log('speed: ' + speed);
	});
	
	// just to stop
	setTimeout(function() {
						download.stopDownload();
					}, 5000);

  
}).listen(8124, "127.0.0.1");

console.log('Server running at http://127.0.0.1:8124/');