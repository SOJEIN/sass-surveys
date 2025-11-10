// src/modules/public-surveys/infrastructure/prisma/prisma-response-write.repo.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ResponseWriteRepo } from '../../domain/repositories/response-write.repo';

@Injectable()
export class PrismaResponseWriteRepo implements ResponseWriteRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async createResponse(args: {
    surveyId: string;
    meta?: {
      respondentId?: string;
      ip?: string | null;
      ua?: string | null;
      locale?: string | null;
      durationMs?: number | null;
    };
    answers: any[];
  }): Promise<{ id: string }> {
    const created = await this.prisma.response.create({
      data: {
        surveyId: args.surveyId,
        respondentId: args.meta?.respondentId ?? null,
        ipAddress: args.meta?.ip ?? null,
        userAgent: args.meta?.ua ?? null,
        locale: args.meta?.locale ?? null,
        durationMs: args.meta?.durationMs ?? null,
        submittedAt: new Date(),
        answers: {
          create: args.answers.map((a) => {
            const base = { questionId: a.questionId };
            if ('text' in a) return { ...base, textValue: a.text };
            if ('value' in a) return { ...base, numberValue: a.value };
            if ('optionId' in a)
              return {
                ...base,
                optionId: a.optionId,
                otherText: a.otherText ?? null,
              };
            if ('optionIds' in a)
              return {
                ...base,
                optionIds: a.optionIds,
                otherText: a.otherText ?? null,
              };
            return base;
          }),
        },
      },
      select: { id: true },
    });

    return created;
  }
}
