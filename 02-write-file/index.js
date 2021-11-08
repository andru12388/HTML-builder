const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const readline = require('readline');
const { stdin: input} = require('process');
const rl = readline.createInterface({ input });

fs.writeFile(
    path.join(__dirname, 'text.txt'),
    '',
    (err) => {
        if (err) throw err;
    }
);

stdout.write('Введите любой текст:\n');

stdin.on('data', data => {
  stdout.write('Ваш текст успешно добавлен!\n');
  fs.appendFile(
    path.join(__dirname, 'text.txt'), 
		data,
    err => {
        if (err) throw err;
    }
	);
});

rl.on('line', line => {
  if (line === 'exit') {
    process.exit();
  }
});

process.on('SIGINT', () => {
	process.exit();
});

process.on('exit', () => stdout.write('Ввод текста закончен. Удачи!'));