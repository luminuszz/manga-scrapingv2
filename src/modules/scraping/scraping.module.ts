import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import jobs from './jobs';
import { ScrapingController } from './scaping.controller';
import { consumers } from './consumers';
import { CapScrappingService } from './services/scaping.service';
import { LoggerModule } from '../logger/logger.module';
import { TasksModule } from 'src/shared/tasks/tasks.module';

@Module({
	imports: [BullModule.registerQueue(...jobs), LoggerModule, TasksModule],
	controllers: [ScrapingController],
	providers: [...consumers, CapScrappingService],
})
export class ScrapingModule {}
