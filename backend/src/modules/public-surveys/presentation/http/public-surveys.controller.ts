// src/modules/public-surveys/presentation/http/public-surveys.controller.ts
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GetPublicSurveyUseCase } from '../../application/use-cases/get-public-survey.usecase';
import { SubmitResponseUseCase } from '../../application/use-cases/submit-response.usecase';

@Controller('public/surveys')
export class PublicSurveysController {
  constructor(
    private readonly getPublicSurvey: GetPublicSurveyUseCase,
    private readonly submitResponse: SubmitResponseUseCase,
  ) {}

  // GET /public/surveys/:slug
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.getPublicSurvey.execute(slug);
  }

  // POST /public/surveys/:slug/responses
  @Post(':slug/responses')
  async submit(
    @Param('slug') slug: string,
    @Body() dto: any, // dto simple; la validación fuerte vive en el use-case
    @Req() req: Request, // para capturar IP/UA si quieres enriquecer meta
  ) {
    const enriched = {
      ...dto,
      meta: {
        ...(dto?.meta ?? {}),
        ip: (req as any)?.ip ?? dto?.meta?.ip,
        ua: (req as any)?.headers?.['user-agent'] ?? dto?.meta?.ua,
      },
    };
    return this.submitResponse.execute(slug, enriched);
  }
}
