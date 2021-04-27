import { Module } from '@nestjs/common';
import { storageFactory } from './implementations';
import { StorageService } from './storage.service';

@Module({
	providers: [storageFactory, StorageService],
	exports: [StorageService],
})
export class StorageModule {}
