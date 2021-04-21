import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueProgress, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { createPDf } from '../jobs';
import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { join } from 'path';

type CapData = {
	pageNumber: number;
	mangaImg: string;
};

export interface JobData {
	pages: CapData[];
	title: string;
	cap: number;
}

@Processor(createPDf.name)
@Injectable()
export class CreatePdfConsumer {
	private getBrowser = async () =>
		puppeteer.launch({
			headless: true,
		});

	private createDocument = (pages: CapData[]) => {
		return pages.map((page) => `<img src="${page.mangaImg}">`);
	};

	@Process()
	async execute(job: Job<JobData>) {
		const { pages: capPages, cap, title } = job.data;

		const browser = await this.getBrowser();
		try {
			const page = await browser.newPage();

			const documentBody = this.createDocument(capPages);

			const parsedDocumentBody = documentBody.join('');

			const document = `<html>${parsedDocumentBody}</html>`;

			console.log(document);

			await page.goto(`data:text/html,${document}`);

			const parsedTitle = title.trim().replace(' ', '');

			await page.pdf({
				path: join(__dirname, '..', '..', '..', '..', 'temp', `${parsedTitle}-cap-${cap}.pdf`),
				format: 'a4',
			});
		} catch (error) {
			console.log(error.message);
		} finally {
			browser.close();
		}
	}

	@OnQueueActive()
	onActive(job: Job) {
		console.log(`Processing job ${job.id} of type ${job.name}...`);
	}

	@OnQueueProgress()
	progress(job: Job, progress: number): void {
		console.log(`proceeding.... ${job.id}, number: ${progress}`);
	}

	@OnQueueFailed()
	error(error: Error) {
		console.log('erro');
		console.log(error);
	}

	@OnQueueCompleted()
	completed(job: Job) {
		console.log(`Job finish ${job.id}`);
	}
}
