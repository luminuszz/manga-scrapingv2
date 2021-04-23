import { WebSocketGateway, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Events } from '../events';

@WebSocketGateway({ transports: ['websocket'] })
export class LoggerGateway implements OnGatewayConnection {
	@WebSocketServer()
	private server: Server;

	public handleConnection(client: Socket) {
		console.log(client.id);
	}

	public createLog(message: string) {
		console.log(message);

		this.server.emit(Events.logger, {
			message: message,
		});
	}

	public async sendFileUrl(file: string) {
		const createFileUrl = `http://localhost:3333/files/${file}`;

		console.log(createFileUrl);

		this.server.emit(Events.file, createFileUrl);
	}
}
