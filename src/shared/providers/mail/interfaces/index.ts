import { File } from '../dtos/createPayload.dto';

abstract class IMailProvider {
	abstract sendEmail(to: string, subject: string, files?: File[]): Promise<any>;
}

export { IMailProvider };
