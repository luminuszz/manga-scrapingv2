import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import jobs from './jobs';
import { ScrapingController } from './controllers/scaping.controller';
import { consumers } from './consumers';
import { LoggerModule } from '../logger/logger.module';
import { TasksModule } from 'src/shared/tasks/tasks.module';
import { StorageModule } from 'src/shared/providers/storage/storage.module';

@Module({
	imports: [BullModule.registerQueue(...jobs), LoggerModule, TasksModule, StorageModule],
	controllers: [ScrapingController],
	providers: [...consumers],
})
export class ScrapingModule {}
