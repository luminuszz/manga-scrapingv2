import { Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
	constructor() {}

	public async saveFile(file: File): Promise<void> {}
}
