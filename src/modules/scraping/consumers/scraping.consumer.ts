import { OnQueueActive, OnQueueCompleted, OnQueueFailed, OnQueueProgress, Process, Processor } from '@nestjs/bull';
import { getInvoice } from '../jobs';
import { Cluster } from 'puppeteer-cluster';
import { LoggerGateway } from 'src/modules/logger/services/logger.gateway';
import { CapData, CapExtract, SelectorKeys } from './dtos/scapping.dto';
import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';
import { join } from 'path';
import { TaskService } from 'src/shared/tasks/task.service';
import { Job } from 'bull';

interface JobData {
	capUrl: string[];
}

@Processor(getInvoice.name)
export class ScapingConsumer {
	constructor(private loggerService: LoggerGateway, private readonly taskService: TaskService) {}

	@OnQueueActive()
	onActive(job: Job) {
		console.log(`Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`);
	}

	@OnQueueProgress()
	progress(job: Job, progress: number): void {
		console.log(`proceeding.... ${job.id}, number: ${progress}`);
	}

	private selectorKeys: Record<SelectorKeys, string> = {
		capNumber: 'em[reader-current-chapter]',
		orientationButton: '.orientation',
		previousPageButton: '.page-previous',
		nextPageButton: '.page-next',
		totalOfPages: 'em[reader-total-pages]',
		authors: '.author',
		mangaImg: '.manga-image img',
		title: '.series-title > .title',
		currentPage: 'em[reader-current-page]',
	};

	private createDocument = (pages: CapData[]) => {
		return pages.map((page) => `<img src="${page.mangaImg}">`);
	};

	private extractPageInformation: TaskFunction<{ url: string }, any> = async ({ data, page, worker }) => {
		try {
			this.loggerService.createLog(`Emit cluser by workerId: ${worker.id} process: ${process.pid}`);

			await page.goto(data.url, {
				waitUntil: 'networkidle2',
			});

			const extract = {
				authors: await page.$eval(this.selectorKeys.authors, (el) => el.innerHTML),
				capNumber: await page.$eval(this.selectorKeys.capNumber, (el) => Number(el.innerHTML)),
				title: await page.$eval(this.selectorKeys.title, (el) => el.innerHTML),
				totalOfPages: await page.$eval(this.selectorKeys.totalOfPages, (el) => Number(el.innerHTML)),
			};

			const pages: CapData[] = [];

			for (let i = 0; i < extract.totalOfPages; i++) {
				const currentPage = await page.$eval(this.selectorKeys.currentPage, (el) => Number(el.innerHTML));

				await page.waitForTimeout(1300);

				const mangaImg = await page.$eval(this.selectorKeys.mangaImg, (el: HTMLImageElement) => el.src);

				pages.push({
					mangaImg,
					pageNumber: currentPage,
				});

				if (currentPage < extract.totalOfPages) {
					await page.click('.page-next');
				}
			}

			const payload: CapExtract = {
				...extract,
				capData: pages,
			};

			console.log('payload');

			const { capData: capPages, title, capNumber: cap } = payload;

			const documentBody = this.createDocument(capPages);

			const parsedDocumentBody = documentBody.join('');

			const document = `<html>${parsedDocumentBody}</html>`;

			await page.goto(`data:text/html,${document}`);

			const parsedTitle = title.replace(/\s/g, '-');

			const dateIsoId = Date.now();

			const filePath = join(__dirname, '..', 'temp', `${dateIsoId}-${parsedTitle}-cap-${cap}.pdf`);

			await page.pdf({
				path: filePath,
				format: 'a4',
			});

			this.taskService.deleteFile(filePath);

			this.loggerService.createLog('PDF gerado com sucesso');

			this.loggerService.createLog('Gerando link para download');

			this.loggerService.createLog('Link com expiração de 2 horas');

			this.loggerService.sendFileUrl(`${dateIsoId}-${parsedTitle}-cap-${cap}.pdf`);

			console.log(process.pid);
		} catch (error) {
			console.log(error);
		}
	};

	@Process()
	public async execute(job: Job<JobData>) {
		try {
			const cluster: Cluster<{ url: string }, any> = await Cluster.launch({
				concurrency: Cluster.CONCURRENCY_CONTEXT,
				maxConcurrency: 10,
				timeout: 50000000,
				puppeteer: {
					args: ['--no-sandbox', '--disable-setuid-sandbox'],
				},
			});

			const { capUrl } = job.data;
			this.loggerService.createLog('Fazendo busca do mangá....');

			this.loggerService.createLog('mangá encontrado, fazendo extração de paginas');

			await cluster.task(this.extractPageInformation);

			for (const url of capUrl) {
				await cluster.queue({ url });
			}

			await cluster.idle();

			await cluster.close();

			this.loggerService.createLog('Finish');
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
