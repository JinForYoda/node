const Events = require('events');
const dotenv = require('dotenv');
dotenv.config();
const events = new Events();

events.on('message', (data, second, third) => {
	console.log("Вы прислали сообщение: " + data);
	console.log('Второй аргумент: ' + second);
})

const MESSAGE = process.env.message || "";
if (MESSAGE) {
	events.emit('message', MESSAGE, 123)
}
else {
	events.emit('message', 'Вы не указали сообщение')
}