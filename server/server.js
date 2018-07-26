import Koa from 'koa';
import http from 'http';
import bodyParser from 'koa-bodyparser';
import validator from 'koa-validate';
import socket from 'socket.io';
import config from './config/server.conf';

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

io.sockets.on('connection', socket => {
	console.log(socket.id);
});
