import { OnQueueCompleted, OnQueueFailed, Process, Processor, OnQueueActive } from '@nestjs/bull';
import { Job as JobType } from 'bull';
import { Jobs } from '../jobs';

import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

interface JobData {
	filePath: string;
}

@Processor(Jobs.deleteFile)
@Injectable()
export class DeleteFileConsumer {
	@Process()
	public async handleProcess(job: JobType<JobData>) {
		const { filePath } = job.data;

		try {
			await fs.promises.unlink(filePath);

			return filePath;
		} catch (error) {
			console.log(error.message);
		}
	}

	@OnQueueCompleted()
	completed(_, data: string) {
		console.log(`queue completed file deleted : ${data}`);
	}

	@OnQueueFailed()
	handleError(error: any) {
		console.log(error.message);
	}

	@OnQueueActive()
	active() {
		console.log('deleteFileQueue active');
	}
}
