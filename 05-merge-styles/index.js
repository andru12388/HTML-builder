const path = require('path');
const fs = require('fs');
const dirPath = path.join(__dirname, 'styles');
const fileCopy = path.join(__dirname, 'project-dist', 'bundle.css');

fs.writeFile(
	fileCopy,
    '',
    (err) => {
        if (err) throw err;
    }
);

fs.readdir(dirPath, { withFileTypes: true }, function(err, items) {
	let onlyFile = [];
	for (const file of items) {
		if(file.isFile()) {
			let pathToFile = path.basename(file.name);
			onlyFile.push(pathToFile);
		}
	};

	let cssFiles = onlyFile.filter(el => path.extname(el) === '.css');
	for (const css of cssFiles) {
		let sourceFile = path.join(__dirname, 'styles', `${css}`);
		const input = fs.createReadStream(sourceFile, 'utf-8');
		let data = [];

		input.on('data', chunk => {
			data.push(chunk);
		});

		input.on('end', (err) => {
			fs.appendFile(
				fileCopy,
				`${data}\n`,
				err => {
					if (err) throw err;
				}
			);
			if (err) throw err;
		});

		input.on('error', error => console.log('Error', error.message));
	}
	console.log('Все css файлы добавлены!');
	if (err) throw err;
});