const path = require('path');
const fs = require('fs');
let dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, function(err, items) {
	for (const file of items) {
		if(file.isFile()) {
			let pathToFile = path.basename(file.name);
			fs.stat(path.join(__dirname, 'secret-folder', `${pathToFile}`), function(err, stats) {
				console.log(path.basename(file.name.substring(0, file.name.indexOf('.'))), '-', path.extname(file.name).substring(1), '-', stats.size * 0.001 + 'kb');
			});
		}
	}
});