import { Controller, Post, Param } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Controller('debug-ws')
export class DebugWsController {
  constructor(private readonly ws: RealtimeGateway) {}

  @Post('emit/:surveyId')
  emit(@Param('surveyId') surveyId: string) {
    this.ws.emitSurveyUpdate(surveyId);
    return { ok: true, surveyId };
  }
}
