import { Injectable } from '@nestjs/common';
import { IStorageProvider } from './dtos/storage.dto';

@Injectable()
export class StorageService {
	constructor(private storageProvider: IStorageProvider) {}

	public async saveFile(file: File): Promise<void> {
		this.storageProvider.saveFile(file);
	}
}
