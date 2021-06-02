import { Injectable } from '@nestjs/common';
import { IMailProvider } from './interfaces';
import { File } from './dtos/createPayload.dto';

interface SendEmailPayload {
	to: string;
	description?: string;
	files: File[];
}

@Injectable()
export class MailService {
	constructor(private readonly mailProvider: IMailProvider) {
		console.log(this.mailProvider);
	}

	async sendEmail({ files, description, to }: SendEmailPayload) {
		await this.mailProvider.sendEmail(to, description, files);
	}
}
