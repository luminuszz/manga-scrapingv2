import { Injectable } from '@nestjs/common';
import { IStorageProvider } from '../dtos/storage.dto';
import { google, drive_v3 } from 'googleapis';
import { web } from '../../../../../credentials.json';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class GoogleDriveStorageProvider implements IStorageProvider {
	private sdk: drive_v3.Drive;

	private folderPath = join(__dirname, '..', '..', '..', '..', '..', '..', 'temp');

	private authCredentials = new google.auth.OAuth2({
		clientId: web.client_id,
		clientSecret: web.client_secret,
		redirectUri: web.redirect_uris[0],
	});

	public async init(token: string) {
		const { tokens } = await this.authCredentials.getToken(token);

		this.authCredentials.setCredentials({ ...tokens });

		this.sdk = google.drive({
			version: 'v3',
			auth: this.authCredentials,
		});
	}

	private async managerFolder(): Promise<string> {
		const verifyFolderExistsQuery = await this.sdk.files.list({
			q: "name='manga'",
		});

		if (verifyFolderExistsQuery.data.files.length) {
			const folderId = verifyFolderExistsQuery.data.files[0].id;

			return folderId;
		}

		const createdFolderQueryResponse = await this.sdk.files.create({
			requestBody: {
				mimeType: 'application/vnd.google-apps.folder',
				name: 'Manga',
			},
			fields: 'id',
		});

		return createdFolderQueryResponse.data.id;
	}

	public async saveFile(): Promise<void> {
		try {
			const folderId = await this.managerFolder();

			const files = await fs.promises.readdir(this.folderPath);

			for (const file of files) {
				const media = {
					mimeType: 'application/pdf',
					body: fs.createReadStream(`${this.folderPath}/${file}`),
				};

				await this.sdk.files.create({
					requestBody: {
						name: file,
						parents: [folderId],
					},
					media: {
						mimeType: media.mimeType,
						body: media.body,
					},
				});
			}
		} catch (error) {
			console.log(error);
		}
	}

	public async generateAuthUrl() {
		const authUrl = this.authCredentials.generateAuthUrl();

		return authUrl;
	}

	createFolder(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
