import { Injectable } from '@nestjs/common';
import { Cluster } from 'puppeteer-cluster';
import { TaskFunction } from 'puppeteer-cluster/dist/Cluster';
import { v4 } from 'uuid';

import { FindChaptersDTO } from '../dtos/chapter.dto';

type Chapter = {
	chapterLink: string;
	chapterNumber: string;
	id: string;
};

@Injectable()
export class ChapterService {
	private domain = 'https://mangalivre.net';

	private selectors = {
		chapters: '.full-chapters-list li',
	};

	private scrapingChapters: TaskFunction<string, Chapter[]> = async ({ data: mangaPage, page }) => {
		try {
			await page.goto(mangaPage, {
				waitUntil: 'networkidle2',
			});

			const chapters = await page.$$eval(this.selectors.chapters, (list) => {
				return list.map((chapter) => ({
					chapterLink: `${chapter.querySelector<HTMLAnchorElement>('[data-id-chapter]').href}`,
					chapterNumber: chapter.querySelector<HTMLSpanElement>('.cap-text').innerText,
				}));
			});

			const formattedChapters = chapters.map((chapter) => ({ ...chapter, id: v4() }));

			return formattedChapters;
		} catch (error) {
			console.log(error);
		}
	};

	async findChapters(payload: FindChaptersDTO) {
		try {
			const { mangaPage } = payload;

			const cluster: Cluster<string, Chapter[]> = await Cluster.launch({
				concurrency: Cluster.CONCURRENCY_CONTEXT,
				maxConcurrency: 10,
				timeout: 50000000,
			});

			cluster.task(this.scrapingChapters);

			const chapters = await cluster.execute(mangaPage);

			await cluster.idle();

			await cluster.close();

			return {
				chapters,
			};
		} catch (error) {
			console.log(error.message);
		}
	}
}
