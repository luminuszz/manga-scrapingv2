import { InjectQueue } from '@nestjs/bull';
import { Controller, Body, Post } from '@nestjs/common';
import { Queue } from 'bull';
import { FindChaptersDTO } from '../dtos/chapter.dto';
import { ScrapingCapDTO } from '../dtos/credentials.dto';
import { InvoiceJobs } from '../dtos/jobs.dto';
import { ChapterService } from '../services/chapter.service';

@Controller('manga')
export class ScrapingController {
	constructor(
		@InjectQueue(InvoiceJobs.getInvoice) private job: Queue<ScrapingCapDTO>,
		private readonly chapterService: ChapterService,
	) {}

	@Post()
	public async getMangaUrl(@Body() credentials: ScrapingCapDTO): Promise<void> {
		const { capUrl } = credentials;

		await this.job.add({
			capUrl,
		});
	}

	@Post('chapter')
	public async getChapters(@Body() data: FindChaptersDTO): Promise<any> {
		const { mangaPage } = data;

		const response = await this.chapterService.findChapters({ mangaPage });

		return response;
	}
}
