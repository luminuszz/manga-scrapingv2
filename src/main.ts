import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.use(cookieParser());
	await app.listen(process.env.API_PORT);

	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
