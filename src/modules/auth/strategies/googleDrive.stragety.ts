import { PassportStrategy } from '@nestjs/passport';
import { OAuth2Strategy } from 'passport-google-oauth';

import { web } from '../../../../credentials.json';

export class GoogleDriveStrategy extends PassportStrategy(OAuth2Strategy) {
	constructor() {
		super({
			clientID: web.client_id,
			clientSecret: web.client_secret,
			callbackURL: web.redirect_uris[0],
			scope: [
				'https://www.googleapis.com/auth/drive.file',
				'https://www.googleapis.com/auth/drive.readonly',
				'https://www.googleapis.com/auth/drive.metadata',
			],
		});
	}
}
