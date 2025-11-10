export interface SurveyReadRepo {
  /**
   * Obtiene una encuesta pública por su slug,
   * incluyendo sus preguntas y opciones.
   */
  findPublicBySlug(slug: string): Promise<any | null>;
}
