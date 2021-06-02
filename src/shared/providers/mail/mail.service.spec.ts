import { MailService } from './mail.service';
import { Test } from '@nestjs/testing';
import { IMailProvider } from './interfaces';

const MockEmailProvider: IMailProvider = {
	async sendEmail(...args) {
		return console.log(...args);
	},
};

describe('mail.service', () => {
	let mailService: MailService;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			providers: [
				MailService,
				{
					provide: IMailProvider,
					useValue: MockEmailProvider,
				},
			],
		}).compile();

		mailService = moduleRef.get<MailService>(MailService);
	});

	it('should be able to called', async () => {
		await mailService.sendEmail({
			to: 'test@example.com',
			files: [],
			description: 'teste2',
		});
	});
});
