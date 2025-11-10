// src/modules/public-surveys/infrastructure/prisma/prisma-survey-read.repo.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SurveyReadRepo } from '../../domain/repositories/survey-read.repo';

@Injectable()
export class PrismaSurveyReadRepo implements SurveyReadRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findPublicBySlug(slug: string): Promise<any | null> {
    return await this.prisma.survey.findUnique({
      where: { slug },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              orderBy: { order: 'asc' },
              select: { id: true, label: true, isOther: true },
            },
          },
        },
      },
    });
  }
}
