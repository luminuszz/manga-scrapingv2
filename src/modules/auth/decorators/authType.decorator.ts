import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { GoogleDriveAuthGuard } from '../guards/googleDrive.guard';

const guards = {
	drive: GoogleDriveAuthGuard,
};

type AuthType = keyof typeof guards;

export const Auth = (type: AuthType): any => applyDecorators(SetMetadata('authType', type), UseGuards(guards[type]));
