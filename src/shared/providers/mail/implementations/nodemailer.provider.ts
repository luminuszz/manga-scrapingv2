import * as NodeMailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { IMailProvider } from '../interfaces';
import { File } from '../dtos/createPayload.dto';

@Injectable()
export class NodeMailerProvider implements IMailProvider {
	private async CreateTransport() {
		const config = {
			host: process.env.GMAIL_SMTP,
			port: process.env.GMAIL_PORT,
			secure: process.env.GMAIL_SECURE,

			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_PASS,
			},
		};

		return NodeMailer.createTransport({
			host: config.host,
			port: config.port,
			secure: !!config.secure,
			auth: {
				user: config.auth.user,
				pass: config.auth.pass,
			},
		} as NodeMailer.TransportOptions);
	}

	async sendEmail(to: string, subject: string, files?: File): Promise<any> {
		try {
			const transport = await this.CreateTransport();

			await transport.sendMail({
				to,
				subject,
				attachments: [...(files as any)],
			});
		} catch (error) {
			console.log(error);
		}
	}
}
