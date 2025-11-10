import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AnalyticsController } from './analytics.controller';

@Module({
  controllers: [AnalyticsController],
  providers: [PrismaClient],
})
export class AnalyticsModule {}
