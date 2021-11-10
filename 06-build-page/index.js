const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const htmlPath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const dirBuildPath = path.join(__dirname, 'project-dist');
const dist = path.join(__dirname, 'project-dist', 'index.html');


// Build HTML

fs.mkdir(dirBuildPath,  { recursive: true }, err => {
	if (err) throw err;
});

new Promise((res, rej) => { res();
}).then(() => {
  return new Promise((res, rej) => { 
    fs.copyFile(htmlPath, path.join(__dirname, 'project-dist', 'index.html'),  (err) => {
			if (err) {
				console.log("Error Found:", err);
			}
			res();
		});
  });
}).then(() => { 
  return new Promise((res, rej) => {
    let onlyFile = {};
    fs.readdir(componentsPath, { withFileTypes: true }, function(err, items) { 
			for (const file of items) {              
				if(file.isFile() && path.extname(file.name).substring(1) === 'html') {
					let pathToFile = path.basename(file.name);
					let nameComponent = path.basename(file.name.substring(0, file.name.indexOf('.')));
					onlyFile[nameComponent] = pathToFile;
				}
			}
			if (err) throw err;
			res(onlyFile);
		});
		
  });
}).then((onlyFile) => {
	return new Promise((res, rej) => {
		async function replaceHtml() {
			try {
			let buildHtml = await fsp.readFile(path.join(__dirname, 'project-dist', 'index.html'));
			for (const html in onlyFile) {
				let sourceFile = path.join(__dirname, 'components', `${onlyFile[html]}`);
				let re = new RegExp('{{' + html + '}}','g');
				let readingSample = await fsp.readFile(sourceFile)
				buildHtml = buildHtml.toString().replace(re, readingSample);
			};
			fsp.writeFile(dist, buildHtml);
			} catch(error) {
				console.error(error.message);
			}
		}
		replaceHtml();
  });
});

// Build Css

const dirPathCss = path.join(__dirname, 'styles');
const fileCopyCss = path.join(__dirname, 'project-dist', 'style.css');

fs.writeFile(
	fileCopyCss,
    '',
    (err) => {
        if (err) throw err;
    }
);

fs.readdir(dirPathCss, { withFileTypes: true }, function(err, items) {
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
				fileCopyCss,
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

// Build Assets

const dirPathFolder = path.join(__dirname, 'assets');
const dirPathCopyFolder = path.join(__dirname, 'project-dist', 'assets');

async function copyFolder(from = dirPathFolder, to = dirPathCopyFolder) {
	try {
    await fsp.mkdir(to,  { recursive: true });
		const items = await fsp.readdir(from, { withFileTypes: true });
		for (const file of items) {
			if(file.isFile()) {
				let pathToFile = path.basename(file.name);
				let sourceFile = path.join(from, `${pathToFile}`);
				let copy = path.join(to, `${pathToFile}`);
				fsp.copyFile(sourceFile, copy);
			} else {
				copyFolder(path.join(from, file.name), path.join(to, file.name));
			}
		}
  } catch(error) {
    console.error(error.message);
  }
};

function copyDir() {
	fs.stat(dirPathCopyFolder, function(err) {
		if (err) {
			copyFolder();
			console.log('Копирование файлов выполнено!')
		} else {
			(async () => {
				await fsp.rm(dirPathCopyFolder, { force: true, recursive: true });
					copyFolder();
					console.log('Копирование файлов выполнено!')	
			})();
		};
	});
};
copyDir();