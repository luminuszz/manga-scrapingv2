import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailProvider } from './implementations';

@Module({
	providers: [MailService, MailProvider],
	exports: [MailService],
})
export class MailModule {}
