import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { PassportModule } from '@nestjs/passport';

import { GoogleDriveStrategy } from './strategies/googleDrive.stragety';
import { StorageModule } from 'src/shared/providers/storage/storage.module';

@Module({
	imports: [PassportModule, StorageModule],
	controllers: [AuthController],
	exports: [AuthService],
	providers: [AuthService, GoogleDriveStrategy],
})
export class AuthModule {}
