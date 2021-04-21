import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';

import * as ModuleConfig from 'src/config/module.config';

import { ScrapingModule } from './modules/scraping/scraping.module';
import { LoggerModule } from './modules/logger/logger.module';
import { AppController } from './app.controller';
import { TasksModule } from './shared/tasks/tasks.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			cache: true,
			isGlobal: true,
			envFilePath: ['.env'],
		}),
		BullModule.forRoot(ModuleConfig.BullModuleConfig),
		EventEmitterModule.forRoot(),
		ScrapingModule,
		LoggerModule,
		TasksModule,
	],
	controllers: [AppController],
})
export class AppModule {}
