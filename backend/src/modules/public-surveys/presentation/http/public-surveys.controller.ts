import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetPublicSurveyUseCase } from '../../application/use-cases/get-public-survey.usecase';
import { SubmitResponseUseCase } from '../../application/use-cases/submit-response.usecase';

@ApiTags('PublicSurveys')
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
    @Body() dto: any,
    @Req() req: Request,
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
