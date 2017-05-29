const WebSocket = require('ws');

var address;
if (process.argv[2] !== undefined) {
	address = process.argv[2];
} else {
	address = 'ws://localhost:8080';
}
const socket = new WebSocket(address);

const ReadLine = require('readline');
const rl = ReadLine.createInterface({
	input: process.stdin,
	output: process.stdout
});

var localUsername;

socket.on('open', function () {
	// console.log('[INFO] Connection open!');
});

socket.on('message', function (data) {
	let parsedData = JSON.parse(data);

	if (parsedData.command === 'writeline') {
		console.log(parsedData.message);
	}
});

rl.on('line', function (userInput) {
	if (localUsername === undefined) {
		if (userInput !== '') {
			localUsername = userInput;
			console.log('Welcome ' + localUsername + '!');
			console.log('');

			socket.send(JSON.stringify({ command: 'login', username: localUsername }));
		} else {
			console.log('Username must not be blank. Try again.');
			getUserName();
		}
	} else {
		let packetObj = {
			command: 'readline',
			input: userInput
		};

		socket.send(JSON.stringify(packetObj));
	}
});

function getUserName () {
	console.log('Welcome user! Please enter your username:');
}

getUserName();
