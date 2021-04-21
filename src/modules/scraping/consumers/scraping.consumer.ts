import {
	InjectQueue,
	OnQueueActive,
	OnQueueCompleted,
	OnQueueFailed,
	OnQueueProgress,
	Process,
	Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { getInvoice } from '../jobs';
import { Injectable } from '@nestjs/common';
import { CapScrappingService, CapExtract as CapScarapingService } from '../services/scaping.service';
import { InvoiceJobs } from '../dtos/jobs.dto';
import { JobData as CreatePdfJobData } from '../consumers/createPdf.consumer';

interface JobData {
	capUrl: string;
}

@Processor(getInvoice.name)
@Injectable()
export class ScapingConsumer {
	constructor(
		private readonly capScrappingService: CapScrappingService,
		@InjectQueue(InvoiceJobs.createPdf) private job: Queue<CreatePdfJobData>,
	) {}

	@OnQueueActive()
	onActive(job: Job) {
		console.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
	}

	@OnQueueProgress()
	progress(job: Job, progress: number): void {
		console.log(`proceeding.... ${job.id}, number: ${progress}`);
	}

	@Process()
	async execute(job: Job<JobData>) {
		return await this.capScrappingService.execute(job.data);
	}

	@OnQueueFailed()
	error(error: Error) {
		console.log('erro');
		console.log(error);
	}

	@OnQueueCompleted()
	completed(job: Job, result: CapScarapingService) {
		console.log(`job ${job.name} id: ${job.id} completed teste`);

		console.log(result);

		this.job.add({
			cap: result.capNumber,
			pages: result.capData,
			title: result.title,
		});
	}
}
