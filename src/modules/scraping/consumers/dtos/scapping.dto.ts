export type SelectorKeys =
	| 'capNumber'
	| 'orientationButton'
	| 'previousPageButton'
	| 'nextPageButton'
	| 'totalOfPages'
	| 'authors'
	| 'mangaImg'
	| 'title'
	| 'currentPage';

export type CapData = {
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
