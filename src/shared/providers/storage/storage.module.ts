import { Module } from '@nestjs/common';
import { storageFactory } from './implementations';
import { StorageService } from './storage.service';
import { GoogleDriveStorageProvider } from './implementations/googleDriveStorage.provider';

@Module({
	providers: [storageFactory, StorageService, GoogleDriveStorageProvider],
	exports: [StorageService, GoogleDriveStorageProvider],
})
export class StorageModule {}
