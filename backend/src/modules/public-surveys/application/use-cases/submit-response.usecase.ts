// src/modules/public-surveys/application/use-cases/submit-response.usecase.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { SurveyReadRepo } from '../../domain/repositories/survey-read.repo';
import type { ResponseWriteRepo } from '../../domain/repositories/response-write.repo';
import { RealtimeGateway } from '../../../../realtime/realtime.gateway';

// 👇 Agrega estos tipos mínimos (ajústalos si ya existen en tu dominio)
type QuestionType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'NUMBER'
  | 'RATING'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE';

interface QuestionEntity {
  id: string;
  type: QuestionType;
  isRequired: boolean;
  options?: { id: string; text: string }[];
}

type SurveyStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

interface SurveyEntity {
  id: string;
  status: SurveyStatus;
  questions: QuestionEntity[];
}

interface AnswerEntity {
  questionId: string;
  text?: string;
  value?: number;
  optionId?: string;
  optionIds?: string[];
}

interface SubmitMeta {
  respondentId?: string;
  ip?: string | null;
  ua?: string | null;
  locale?: string | null;
  durationMs?: number | null;
}

@Injectable()
export class SubmitResponseUseCase {
  constructor(
    private readonly surveys: SurveyReadRepo,
    private readonly responses: ResponseWriteRepo,
    private readonly realtime: RealtimeGateway,
  ) {}

  async execute(
    slug: string,
    dto: { answers?: AnswerEntity[]; meta?: SubmitMeta },
  ) {
    // ⛑️ Tipamos el resultado del repo
    const survey = (await this.surveys.findPublicBySlug(
      slug,
    )) as SurveyEntity | null;
    if (!survey) throw new NotFoundException('Survey not found');
    if (survey.status !== 'PUBLISHED')
      throw new BadRequestException('Survey not open');

    // ⛑️ Tipamos preguntas y respuestas
    const questions = (survey.questions ?? []) as QuestionEntity[];
    const answers = (dto?.answers ?? []) as AnswerEntity[];

    // Mapa tipado correctamente
    const questionMap = new Map<string, QuestionEntity>(
      questions.map((q) => [q.id, q]),
    );

    // Validación básica de correspondencia pregunta <-> tipo
    for (const a of answers) {
      const q = questionMap.get(a.questionId);
      if (!q)
        throw new BadRequestException(`Invalid question: ${a.questionId}`);

      // Validaciones por tipo
      if (q.isRequired) {
        if (['SHORT_TEXT', 'LONG_TEXT'].includes(q.type) && !a.text?.trim())
          throw new BadRequestException(`Question required: ${q.id}`);
        if (['NUMBER', 'RATING'].includes(q.type) && a.value == null)
          throw new BadRequestException(`Question required: ${q.id}`);
        if (q.type === 'SINGLE_CHOICE' && !a.optionId)
          throw new BadRequestException(`Question required: ${q.id}`);
        if (
          q.type === 'MULTIPLE_CHOICE' &&
          (!a.optionIds || !a.optionIds.length)
        )
          throw new BadRequestException(`Question required: ${q.id}`);
      }

      // Validar opciones existentes (si aplica)
      if (q.options?.length) {
        if (q.type === 'SINGLE_CHOICE' && a.optionId) {
          const valid = q.options.some((o) => o.id === a.optionId);
          if (!valid)
            throw new BadRequestException(
              `Invalid option for question: ${q.id}`,
            );
        }
        if (q.type === 'MULTIPLE_CHOICE' && a.optionIds) {
          const allValid = a.optionIds.every((id) =>
            q.options!.some((o) => o.id === id),
          );
          if (!allValid)
            throw new BadRequestException(
              `Invalid option(s) for question: ${q.id}`,
            );
        }
      }
    }

    // Guardar respuestas
    const created = await this.responses.createResponse({
      surveyId: survey.id,
      meta: {
        respondentId: dto.meta?.respondentId,
        ip: dto.meta?.ip ?? null,
        ua: dto.meta?.ua ?? null,
        locale: dto.meta?.locale ?? null,
        durationMs: dto.meta?.durationMs ?? null,
      },
      answers: dto.answers ?? [],
    });

    this.realtime.emitSurveyUpdate(survey.id);

    return { id: created.id };
  }
}
