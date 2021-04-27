import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PassportModule } from '@nestjs/passport';

import { GoogleDriveStrategy } from './strategies/googleDrive.stragety';

@Module({
	imports: [PassportModule],
	controllers: [AuthController],
	exports: [AuthService],
	providers: [AuthService, GoogleDriveStrategy],
})
export class AuthModule {}
