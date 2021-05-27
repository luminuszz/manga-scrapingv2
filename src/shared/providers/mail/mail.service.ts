import { Injectable } from '@nestjs/common';
import { IMailProvider } from './interfaces';
import { FilePayload } from './dtos/createPayload.dto';

@Injectable()
export class MailService {
	constructor(private readonly mailProvider: IMailProvider) {
		console.log(this.mailProvider);
	}

	async sendFiles(payload: FilePayload) {
		console.log(payload);
	}
}
