import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

type QType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'RATING'
  | 'NUMBER';

type BaseResult = {
  questionId: string;
  title: string;
  type: QType;
};

type SingleChoiceResult = BaseResult & {
  total: number;
  options: { optionId: string; label: string; count: number }[];
};

type MultipleChoiceResult = BaseResult & {
  totalResponses: number;
  options: { optionId: string; label: string; count: number }[];
};

type NumericResult = BaseResult & {
  count: number;
  average: number | null;
  sum: number;
};

type TextResult = BaseResult & {
  count: number;
  samples: string[];
};

type AnalyticsResult =
  | SingleChoiceResult
  | MultipleChoiceResult
  | NumericResult
  | TextResult;
@ApiTags('Analytics')
@Controller('analytics/surveys')
export class AnalyticsController {
  constructor(private readonly prisma: PrismaClient) {}

  @Get(':id/summary')
  async summary(@Param('id') surveyId: string) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
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
    if (!survey) throw new NotFoundException('Survey not found');

    // 2) Pre-cargar answers relevantes (evitamos N consultas)
    const allAnswers = await this.prisma.answer.findMany({
      where: { question: { surveyId } },
      select: {
        id: true,
        questionId: true,
        textValue: true,
        numberValue: true,
        optionId: true,
        optionIds: true, // Json[] (string[])
        otherText: true,
        createdAt: true,
      },
    });

    const byQuestion = new Map<string, typeof allAnswers>();
    for (const a of allAnswers) {
      if (!byQuestion.has(a.questionId)) byQuestion.set(a.questionId, []);
      byQuestion.get(a.questionId)!.push(a);
    }

    // 3) Construir resumen por pregunta
    const results: AnalyticsResult[] = [];
    for (const q of survey.questions) {
      const qAnswers = byQuestion.get(q.id) ?? [];
      const base = { questionId: q.id, title: q.title, type: q.type as QType };

      if (q.type === 'SINGLE_CHOICE') {
        // Conteo por optionId
        const counts = new Map<string, number>();
        for (const opt of q.options ?? []) counts.set(opt.id, 0);
        for (const a of qAnswers) {
          if (a.optionId && counts.has(a.optionId)) {
            counts.set(a.optionId, (counts.get(a.optionId) ?? 0) + 1);
          }
        }
        results.push({
          ...base,
          total: qAnswers.length,
          options: (q.options ?? []).map((o) => ({
            optionId: o.id,
            label: o.label,
            count: counts.get(o.id) ?? 0,
          })),
        });
      } else if (q.type === 'MULTIPLE_CHOICE') {
        // optionIds es un array JSON → sumamos en JS
        const counts = new Map<string, number>();
        for (const opt of q.options ?? []) counts.set(opt.id, 0);

        for (const a of qAnswers) {
          const arr = (a.optionIds as unknown as string[]) ?? [];
          for (const oid of arr) {
            if (counts.has(oid)) counts.set(oid, (counts.get(oid) ?? 0) + 1);
          }
        }
        results.push({
          ...base,
          totalResponses: new Set(qAnswers.map((a) => a.id)).size,
          options: (q.options ?? []).map((o) => ({
            optionId: o.id,
            label: o.label,
            count: counts.get(o.id) ?? 0,
          })),
        });
      } else if (q.type === 'RATING' || q.type === 'NUMBER') {
        const nums = qAnswers
          .map((a) => a.numberValue)
          .filter((v): v is number => typeof v === 'number');
        const count = nums.length;
        const sum = nums.reduce((acc, n) => acc + n, 0);
        const avg = count ? sum / count : null;
        results.push({ ...base, count, average: avg, sum });
      } else if (q.type === 'SHORT_TEXT' || q.type === 'LONG_TEXT') {
        const texts = qAnswers
          .map((a) => a.textValue?.trim())
          .filter((t): t is string => !!t)
          .sort((a, b) => 0)
          .slice(-3);
        results.push({ ...base, count: texts.length, samples: texts });
      }
    }

    return {
      survey: { id: survey.id, title: survey.title, status: survey.status },
      questions: results,
    };
  }
}
