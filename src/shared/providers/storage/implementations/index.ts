import { Type } from '@nestjs/common';
import { GoogleDriveStorageProvider } from './googleDriveStorage.provider';
import { IStorageProvider } from '../dtos/storage.dto';

type Provider = 'google';

type ProvidersList<T> = Record<Provider, Type<T>>;

export const storageFactory = {
	provide: IStorageProvider,

	useFactory: () => {
		const env = process.env.STORAGE_PROVIDER as Provider;

		const providers: ProvidersList<unknown> = {
			google: GoogleDriveStorageProvider,
		};

		return {
			useClass: providers[env],
			provide: IStorageProvider,
		};
	},
};
