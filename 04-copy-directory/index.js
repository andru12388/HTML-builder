const path = require('path');
const fs = require('fs');
const dirPath = path.join(__dirname, 'files');
const dirPathCopy = path.join(__dirname, 'files-copy');

function copyDir() {
	fs.stat(dirPathCopy, function(err) {
		if (err) {
			fs.mkdir(path.join(__dirname, 'files-copy'),  { recursive: true }, err => {
				if (err) throw err;
			});
			
			fs.readdir(dirPath, { withFileTypes: true }, function(err, items) {
				for (const file of items) {
					if(file.isFile()) {
						let pathToFile = path.basename(file.name);
						let sourceFile = path.join(__dirname, 'files', `${pathToFile}`);
						let copy = path.join(__dirname, 'files-copy', `${pathToFile}`);
						fs.copyFile(sourceFile, copy,  (err) => {
							if (err) {
								console.log("Error Found:", err);
							}
							
						});
					}
				}
				if (err) throw err;
				console.log('Копирование файлов выполнено!')
			});
	
		} else {
			fs.readdir(dirPathCopy, { withFileTypes: true }, function(err, items) {
				for (const file of items) {
					if(file.isFile()) {
						fs.unlink(path.join(__dirname, 'files-copy', `${path.basename(file.name)}`), err => {
							if (err) throw err;
						});
					}
				}
				if (err) throw err;
			});
	
			fs.mkdir(path.join(__dirname, 'files-copy'),  { recursive: true }, err => {
				if (err) throw err;
			});
			
			fs.readdir(dirPath, { withFileTypes: true }, function(err, items) {
				for (const file of items) {
					if(file.isFile()) {
						let pathToFile = path.basename(file.name);
						let sourceFile = path.join(__dirname, 'files', `${pathToFile}`);
						let copy = path.join(__dirname, 'files-copy', `${pathToFile}`);
						fs.copyFile(sourceFile, copy,  (err) => {
							if (err) {
								console.log("Error Found:", err);
							}
							
						});
					}
				}
				if (err) throw err;
				console.log('Копирование файлов выполнено!')
			});
		}
		
	});
};
copyDir();

