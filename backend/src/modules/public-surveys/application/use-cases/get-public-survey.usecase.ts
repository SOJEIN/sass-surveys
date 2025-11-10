// src/modules/public-surveys/application/use-cases/get-public-survey.usecase.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { SurveyReadRepo } from '../../domain/repositories/survey-read.repo';

@Injectable()
export class GetPublicSurveyUseCase {
  constructor(private readonly surveys: SurveyReadRepo) {}

  async execute(slug: string) {
    const survey = await this.surveys.findPublicBySlug(slug);
    if (!survey) throw new NotFoundException('Survey not found');

    if (!survey.isPublic || survey.status !== 'PUBLISHED') {
      throw new BadRequestException('Survey is not available');
    }

    return survey;
  }
}
