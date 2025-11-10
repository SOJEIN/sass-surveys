export interface ResponseWriteRepo {
  /**
   * Crea un nuevo envío de respuestas para una encuesta.
   * Retorna el ID del registro creado.
   */
  createResponse(args: {
    surveyId: string;
    meta?: {
      respondentId?: string;
      ip?: string | null;
      ua?: string | null;
      locale?: string | null;
      durationMs?: number | null;
    };
    answers: any[]; // luego reemplazamos por un tipo más estricto
  }): Promise<{ id: string }>;
}
