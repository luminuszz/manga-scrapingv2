import { Controller, Get, Param, Res } from '@nestjs/common';
import { join } from 'path';
import { Response as ExpressResponse } from 'express';
import * as fs from 'fs';

enum Teste {
	tete1 = 'teste',
	teste2 = '254',
}

const strings = Object.keys(Teste).map((key: keyof typeof Teste) => Teste[key]);

console.log('strings', strings);

@Controller()
export class AppController {
	@Get('files/:fileName')
	public async getFile(@Param('fileName') fileName: string, @Res() response: ExpressResponse) {
		const baseTempPathFile = join(__dirname, '..', 'temp', fileName);

		const verifyExistsFile = fs.existsSync(baseTempPathFile);

		if (!verifyExistsFile) {
			return response.status(404).json({
				message: 'file not found',
			});
		}

		return response.sendFile(baseTempPathFile);
	}
}
