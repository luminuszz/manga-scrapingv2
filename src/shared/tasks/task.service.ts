import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Jobs } from './jobs';

type JobDataDeleteFile = {
	filePath: string;
};

@Injectable()
export class TaskService {
	constructor(@InjectQueue(Jobs.deleteFile) private deleteFileQueue: Queue<JobDataDeleteFile>) {}

	public deleteFile(filePath: string, delay = 7200000) {
		this.deleteFileQueue.add(
			{
				filePath,
			},
			{
				delay,
			},
		);
	}
}
