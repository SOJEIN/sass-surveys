// src/modules/public-surveys/presentation/http/public-surveys.module.ts
import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PublicSurveysController } from './public-surveys.controller';
import { GetPublicSurveyUseCase } from '../../application/use-cases/get-public-survey.usecase';
import { SubmitResponseUseCase } from '../../application/use-cases/submit-response.usecase';
import { PrismaSurveyReadRepo } from '../../infrastructure/prisma/prisma-survey-read.repo';
import { PrismaResponseWriteRepo } from '../../infrastructure/prisma/prisma-response-write.repo';
import { TOKENS } from '../../tokens';
import { RealtimeModule } from '../../../../realtime/realtime.module';
import { RealtimeGateway } from '../../../../realtime/realtime.gateway';

@Module({
  imports: [RealtimeModule],
  controllers: [PublicSurveysController],
  providers: [
    PrismaClient,

    // Implementaciones de repositorios
    { provide: TOKENS.SurveyReadRepo, useClass: PrismaSurveyReadRepo },
    { provide: TOKENS.ResponseWriteRepo, useClass: PrismaResponseWriteRepo },

    // Casos de uso (inyección de dependencias)
    {
      provide: GetPublicSurveyUseCase,
      useFactory: (surveyRepo: PrismaSurveyReadRepo) =>
        new GetPublicSurveyUseCase(surveyRepo),
      inject: [TOKENS.SurveyReadRepo],
    },
    {
      provide: SubmitResponseUseCase,
      useFactory: (
        surveyRepo: PrismaSurveyReadRepo,
        responseRepo: PrismaResponseWriteRepo,
        realtime: RealtimeGateway,
      ) => new SubmitResponseUseCase(surveyRepo, responseRepo, realtime),
      inject: [TOKENS.SurveyReadRepo, TOKENS.ResponseWriteRepo],
    },
  ],
})
export class PublicSurveysModule {}
