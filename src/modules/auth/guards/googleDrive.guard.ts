import { AuthGuard } from '@nestjs/passport';

export class GoogleDriveAuthGuard extends AuthGuard('google') {}
