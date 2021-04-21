import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Events } from '../events';

@WebSocketGateway({ namespace: Events.logger })
@Injectable()
export class LoggerGateway {
	@WebSocketServer()
	private server: Server;

	public async createLog(message: string) {
		this.emitLog(message);
	}

	private emitLog(message: string) {
		this.server.emit(Events.logger, message);
	}

	public async sendFileUrl(file: string) {
		const createFileUrl = `http://localhost:300/files/?file=${file}`;

		this.server.emit(Events.file, createFileUrl);
	}
}
