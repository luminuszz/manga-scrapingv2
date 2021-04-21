import { IoAdapter } from '@nestjs/platform-socket.io';
import { RedisClient } from 'redis';
import { createAdapter } from 'socket.io-redis';

export class RedisIoAdapter extends IoAdapter {
	createIOServer(port: number, options?: any): any {
		const server = super.createIOServer(port, options);

		const pubClient = new RedisClient({
			host: process.env.REDIS_HOST,
			port: Number(process.env.REDIS_PORT),
		});

		const redisAdapter = createAdapter({
			pubClient,
			subClient: pubClient.duplicate(),
		});

		server.adapter(redisAdapter);

		return server;
	}
}
