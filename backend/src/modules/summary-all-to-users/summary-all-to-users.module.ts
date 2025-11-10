import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RealtimeModule } from '../../realtime/realtime.module';
import { SummaryAllToUsersController } from './summary-all-to-users.controller';
import { SummaryAllToUsersService } from './summary-all-to-users.service';

@Module({
  imports: [RealtimeModule],
  controllers: [SummaryAllToUsersController],
  providers: [SummaryAllToUsersService, PrismaClient],
  exports: [SummaryAllToUsersService],
})
export class SummaryAllToUsersModule {}
