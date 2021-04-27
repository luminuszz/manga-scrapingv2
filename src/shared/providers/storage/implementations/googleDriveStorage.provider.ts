import { Injectable } from '@nestjs/common';
import { IStorageProvider } from '../dtos/storage.dto';
import { google, drive_v2 } from 'googleapis';
import { web } from '../../../../../credentials.json';

@Injectable()
export class GoogleDriveStorageProvider implements IStorageProvider {
	private sdk: drive_v2.Drive;

	private authCredentials = new google.auth.OAuth2({
		clientId: web.client_id,
		clientSecret: web.client_secret,
		redirectUri: web.redirect_uris[0],
	});

	constructor() {
		this.sdk = google.drive({
			version: 'v2',
			auth: this.authCredentials,
		});
	}

	public async saveFile(file: File): Promise<void> {
		await this.sdk.files.insert({});
	}

	public async generateAuthUrl() {
		const authUrl = this.authCredentials.generateAuthUrl();

		return authUrl;
	}

	createFolder(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
