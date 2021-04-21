import { Module } from '@nestjs/common';
import { LoggerGateway } from './gateway/logger.gateway';

@Module({
	providers: [LoggerGateway],
	exports: [LoggerGateway],
})
export class LoggerModule {}
