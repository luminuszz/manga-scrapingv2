import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { allJobs } from './jobs';
import { consumers } from './consumers';
import { TaskService } from './task.service';

@Module({
	imports: [BullModule.registerQueue(...allJobs)],
	providers: [...consumers, TaskService],
	exports: [TaskService],
})
export class TasksModule {}
