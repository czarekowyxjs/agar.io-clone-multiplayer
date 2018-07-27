import Koa from 'koa';
import http from 'http';
import bodyParser from 'koa-bodyparser';
import validator from 'koa-validate';
import socket from 'socket.io';
import config from './config/server.conf';
import generateInitialPoints from './libs/generateInitialPoints';

// api controller
import ApiController from './controllers/ApiController';

// socket.io handlers
import Game from './socket/Game';

const app = new Koa();

// middlewares
app.use(bodyParser({
	jsonLimit: '512kb'
}));

validator(app);

// use controllers/routes
app.use(ApiController.routes());

const server = http.createServer(app.callback()).listen(config.port, () => {
	console.log('Server is running');
});

const io = socket.listen(server);

let game;
let users = [];
let points = [];

points = generateInitialPoints();

io.sockets.on('connection', socket => {
	game = new Game(io, socket, users, points);
});
