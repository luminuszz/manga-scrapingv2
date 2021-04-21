import { BullModuleOptions } from '@nestjs/bull';

export const BullModuleConfig: BullModuleOptions = {
	redis: {
		port: Number(process.env.REDIS_PORT),
		host: process.env.REDIS_HOST,
	},
};
