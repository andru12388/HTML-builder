const path = require('path');
const fs = require('fs');
let dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, { withFileTypes: true }, function(err, items) {
	for (const file of items) {
		if(file.isFile()) {
			let pathToFile = path.basename(file.name);
			fs.stat(path.join(__dirname, 'secret-folder', `${pathToFile}`), function(err, stats) {
				const nameFile =  path.parse(file.name);
				console.log(nameFile.name, '-', nameFile.ext.substring(1), '-', stats.size * 0.001 + 'kb');
			});
		}
	}
});