import { Module } from '@nestjs/common';
import { LoggerGateway } from './services/logger.gateway';

@Module({
	providers: [LoggerGateway],
	exports: [LoggerGateway],
})
export class LoggerModule {}
