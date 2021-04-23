import { InjectQueue } from '@nestjs/bull';
import { Controller, Body, Post } from '@nestjs/common';
import { Queue } from 'bull';
import { CredentialsDTO } from '../dtos/credentials.dto';
import { InvoiceJobs } from '../dtos/jobs.dto';

@Controller('manga')
export class ScrapingController {
	constructor(@InjectQueue(InvoiceJobs.getInvoice) private job: Queue<CredentialsDTO>) {}

	@Post()
	public async getMangaUrl(@Body() credentials: CredentialsDTO): Promise<void> {
		const { capUrl } = credentials;

		await this.job.add({
			capUrl,
		});
	}
}
