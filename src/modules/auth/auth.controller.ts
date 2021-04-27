import { Body, Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import express from 'express';

@Controller('auth')
export class AuthController {
	@UseGuards(AuthGuard('google'))
	@Get('drive')
	async login() {}

	@Get('drive/callback')
	async callback(@Query('code') code: string) {
		console.log(code);

		return {
			message: code,
		};
	}
}
