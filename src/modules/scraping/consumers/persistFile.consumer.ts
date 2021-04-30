import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueProgress, Process, Processor } from '@nestjs/bull';
import { getInvoice } from '../jobs';
import { Job } from 'bull';

interface JobData {
	capUrl: string[];
}

@Processor(getInvoice.name)
export class ScapingConsumer {
	@OnQueueActive()
	onActive(job: Job) {
		console.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
	}

	@OnQueueProgress()
	progress(job: Job, progress: number): void {
		console.log(`proceeding.... ${job.id}, number: ${progress}`);
	}

	@Process()
	public async execute(job: Job<JobData>) {
		try {
		} catch (error) {
			console.log(error);
		}
	}

	@OnQueueFailed()
	error(error: Error) {
		console.log('erro');
		console.log(error);
	}

	@OnQueueCompleted()
	completed(job: Job) {
		console.log(`job ${job.name} id: ${job.id} completed`);
	}
}
