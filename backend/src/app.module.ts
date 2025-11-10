import { Module } from '@nestjs/common';
import { SummaryAllToUsersModule } from './modules/summary-all-to-users/summary-all-to-users.module';
import { PrismaModule } from './prisma/prisma.module';
import { DebugWsController } from './realtime/debug-ws.controller';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [PrismaModule, RealtimeModule, SummaryAllToUsersModule],
  controllers: [DebugWsController],
})
export class AppModule {}
