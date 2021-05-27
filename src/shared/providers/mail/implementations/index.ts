import { NodeMailerProvider } from './nodemailer.provider';
import { IMailProvider } from '../interfaces';
import { Provider } from '@nestjs/common';

const MailProvider: Provider = {
	provide: IMailProvider,
	useClass: process.env.NODE_ENV === 'development' ? NodeMailerProvider : NodeMailerProvider,
	inject: [],
};

export { MailProvider };
