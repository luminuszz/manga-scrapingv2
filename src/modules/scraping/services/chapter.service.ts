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

interface MangaPageScrapingData {
	chapters: Chapter[];
	mangaTitle: string;
	mangaAuthor: string;
	mangaImag: string;
}

@Injectable()
export class ChapterService {
	private selectors = {
		chapters: '.full-chapters-list li',
		mangaTitle: '.series-info .series-title h1',
		mangaAuthor: '.series-info .series-author',
		mangaImg: '.cover img',
	};

	private scrapingChapters: TaskFunction<string, MangaPageScrapingData> = async ({ data: mangaPage, page }) => {
		try {
			await page.goto(mangaPage, {
				waitUntil: 'networkidle2',
			});

			const chapters = await page.$$eval(this.selectors.chapters, (list) => {
				return list.map((chapter) => ({
					chapterLink: `${chapter.querySelector<HTMLAnchorElement>('[data-id-chapter]').href}`,
					chapterNumber: chapter.querySelector<HTMLSpanElement>('.cap-text').innerText,
					publicationData: chapter.querySelector<HTMLSpanElement>('.chapter-date').innerText,
					scanName: chapter.querySelector<HTMLAnchorElement>('.scanlator-name a').innerText,
				}));
			});

			const mangaTitle = await page.$eval(this.selectors.mangaTitle, (element) => element.innerHTML);
			const mangaAuthor = await page.$$eval(this.selectors.mangaAuthor, (element: any) => element[1].innerText);
			const mangaImag = await page.$eval(this.selectors.mangaImg, (element: HTMLImageElement) => element.src);

			const formattedChapters = chapters.map((chapter) => ({ ...chapter, id: v4() }));

			return {
				chapters: formattedChapters,
				mangaAuthor,
				mangaTitle,
				mangaImag,
			};
		} catch (error) {
			console.log(error);
		}
	};

	async findChapters(payload: FindChaptersDTO) {
		try {
			const { mangaPage } = payload;

			const cluster: Cluster<string, MangaPageScrapingData> = await Cluster.launch({
				concurrency: Cluster.CONCURRENCY_CONTEXT,
				maxConcurrency: 10,
				timeout: 50000000,
			});

			cluster.task(this.scrapingChapters);

			const mangaScrapingData = await cluster.execute(mangaPage);

			await cluster.idle();

			await cluster.close();

			return {
				mangaScrapingData,
			};
		} catch (error) {
			console.log(error.message);
		}
	}
}
