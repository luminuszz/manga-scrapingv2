import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

interface Payload {
	capUrl: string;
}

@Injectable()
export class ValidationMangaUrl implements PipeTransform {
	transform(payload: Payload) {
		const isEmpty = !payload.capUrl.length;

		if (isEmpty) {
			throw new BadRequestException('capUrl is empty');
		}
	}
}
