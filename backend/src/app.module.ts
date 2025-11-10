import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { PublicSurveysModule } from './modules/public-surveys/presentation/http/public-surveys.module';
import { AnalyticsModule } from './modules/analytics/presentation/http/analytics.module';
import { RealtimeModule } from './realtime/realtime.module';
import { DebugWsController } from './realtime/debug-ws.controller';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    PublicSurveysModule,
    AnalyticsModule,
    RealtimeModule,
  ],
  controllers: [DebugWsController],
})
export class AppModule {}
