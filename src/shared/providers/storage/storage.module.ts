import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { GoogleDriveStorageProvider } from './services/googleDriveStorage.service';

@Module({
	providers: [StorageService, GoogleDriveStorageProvider],
	exports: [StorageService, GoogleDriveStorageProvider],
})
export class StorageModule {}
