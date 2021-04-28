/* eslint-disable @typescript-eslint/no-empty-function */
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Auth } from './decorators/authType.decorator';
import { Response } from 'express';
import { GoogleDriveStorageProvider } from 'src/shared/providers/storage/implementations/googleDriveStorage.provider';

@Controller('auth')
export class AuthController {
	constructor(private readonly googleDriveStorageProvider: GoogleDriveStorageProvider) {}

	@Get('drive')
	@Auth('drive')
	async login() {}

	@Get('drive/callback')
	async callback(@Query('code') code: string, @Res() res: Response) {
		res.cookie('googleKey', code, {});

		await this.googleDriveStorageProvider.init(code);

		await this.googleDriveStorageProvider.saveFile();

		return res.redirect('http://localhost:3000');
	}
}
