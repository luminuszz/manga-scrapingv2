import { Injectable } from '@nestjs/common';

import * as puppeteer from 'puppeteer';

interface Payload {
	capUrl: string;
}

type SelectorKeys =
	| 'capNumber'
	| 'orientationButton'
	| 'previousPageButton'
	| 'nextPageButton'
	| 'totalOfPages'
	| 'authors'
	| 'mangaImg'
	| 'title'
	| 'currentPage';

/**
 * capNumber: @number atribute 'reader-current-chapter' - check
 * orientationButton: class 'orientation' - check
 * previousPageButton: class 'page-previous' - check
 * nextPageButton: class 'class="page-next"' - check
 * totalOfPages : atribute reader-total-pages - check
 * authors: class 'author' - check
 * title: class "title" - check
 * mangaImg: class "manga-image"
 *
 */

type CapData = {
	pageNumber: number;
	mangaImg: string;
};

export interface CapExtract {
	capNumber: number;
	totalOfPages: number;
	authors: string;
	title: string;
	capData: CapData[];
}

@Injectable()
export class CapScrappingService {
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

	private getBrowser = async () =>
		await puppeteer.launch({
			headless: false,
		});

	private extractPageInformation = async (page: puppeteer.Page) => {
		const extract = {
			authors: await page.$eval(this.selectorKeys.authors, (el) => el.innerHTML),
			capNumber: await page.$eval(this.selectorKeys.capNumber, (el) => Number(el.innerHTML)),
			title: await page.$eval(this.selectorKeys.title, (el) => el.innerHTML),
			totalOfPages: await page.$eval(this.selectorKeys.totalOfPages, (el) => Number(el.innerHTML)),
		};

		const pages: CapData[] = [];

		for (let i = 0; i < extract.totalOfPages; i++) {
			const currentPage = await page.$eval(this.selectorKeys.currentPage, (el) => Number(el.innerHTML));

			await page.waitForTimeout(1500);

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

		return payload;
	};

	public async execute({ capUrl }: Payload) {
		const browser = await this.getBrowser();

		try {
			const page = await browser.newPage();

			await page.goto(capUrl, {
				waitUntil: 'networkidle2',
			});

			const response = await this.extractPageInformation(page);

			return response;
		} catch (error) {
			console.log(error);
		} finally {
			await browser.close();
		}
	}
}
