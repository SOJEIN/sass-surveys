// prisma/seed.ts
import { PrismaClient, QuestionType, SurveyStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1) Upsert de la encuesta raíz (por slug para que sea idempotente)
  const survey = await prisma.survey.upsert({
    where: { slug: 'encuesta-demo' },
    update: {
      title: 'Encuesta de Satisfacción SaaS (Demo)',
      description: 'Ayúdanos a mejorar tu experiencia con el producto.',
      status: SurveyStatus.PUBLISHED,
      isPublic: true,
      allowAnonymous: true,
      publishedAt: new Date(),
      settings: { theme: 'default', showProgress: true },
    },
    create: {
      slug: 'encuesta-demo',
      title: 'Encuesta de Satisfacción SaaS (Demo)',
      description: 'Ayúdanos a mejorar tu experiencia con el producto.',
      status: SurveyStatus.PUBLISHED,
      isPublic: true,
      allowAnonymous: true,
      publishedAt: new Date(),
      settings: { theme: 'default', showProgress: true },
    },
  });

  // 2) Limpieza de preguntas previas (evita duplicados al re-seedear)
  //    onDelete: Cascade en Option borra opciones automáticamente.
  await prisma.question.deleteMany({ where: { surveyId: survey.id } });

  // 3) Creación de preguntas con opciones (cuando aplica)
  //    Usamos create con relaciones anidadas para mayor claridad.
  //    Ordenamos con "order" para el render del front.
  await prisma.question.create({
    data: {
      surveyId: survey.id,
      title: '¿Qué tan satisfecho estás con el producto?',
      description: 'Piensa en tu experiencia general durante el último mes.',
      type: QuestionType.SINGLE_CHOICE,
      isRequired: true,
      order: 1,
      options: {
        create: [
          {
            label: 'Muy satisfecho',
            value: 'muy_satisfecho',
            order: 1,
            score: 5,
          },
          { label: 'Satisfecho', value: 'satisfecho', order: 2, score: 4 },
          { label: 'Neutral', value: 'neutral', order: 3, score: 3 },
          { label: 'Insatisfecho', value: 'insatisfecho', order: 4, score: 2 },
          {
            label: 'Muy insatisfecho',
            value: 'muy_insatisfecho',
            order: 5,
            score: 1,
          },
          {
            label: 'Otro (especifica)',
            value: 'otro',
            order: 6,
            isOther: true,
          },
        ],
      },
      settings: { group: 'satisfaccion_general' },
    },
  });

  await prisma.question.create({
    data: {
      surveyId: survey.id,
      title: '¿Qué funcionalidades usas con más frecuencia?',
      description: 'Selecciona todas las que apliquen.',
      type: QuestionType.MULTIPLE_CHOICE,
      isRequired: false,
      order: 2,
      options: {
        create: [
          { label: 'Reportes/Analytics', value: 'analytics', order: 1 },
          {
            label: 'Integraciones (API/Slack/etc.)',
            value: 'integraciones',
            order: 2,
          },
          { label: 'Automatizaciones', value: 'automatizaciones', order: 3 },
          { label: 'Gestión de usuarios', value: 'usuarios', order: 4 },
          {
            label: 'Otro (especifica)',
            value: 'otro',
            order: 5,
            isOther: true,
          },
        ],
      },
      settings: { minSelected: 0, maxSelected: 5 },
    },
  });

  await prisma.question.create({
    data: {
      surveyId: survey.id,
      title:
        'En una escala del 1 al 5, ¿qué tan probable es que recomiendes nuestro producto?',
      description: '1 = Nada probable, 5 = Muy probable.',
      type: QuestionType.RATING,
      isRequired: true,
      order: 3,
      // Para RATING no necesitamos options; controlaremos desde settings.
      settings: { min: 1, max: 5, step: 1 },
    },
  });

  await prisma.question.create({
    data: {
      surveyId: survey.id,
      title: '¿Cuál es el tamaño de tu equipo?',
      description: 'Ingresa un número aproximado.',
      type: QuestionType.NUMBER,
      isRequired: false,
      order: 4,
      settings: { min: 1, max: 5000 },
    },
  });

  await prisma.question.create({
    data: {
      surveyId: survey.id,
      title: '¿Qué mejorarías del producto?',
      description: 'Comparte tus ideas o comentarios.',
      type: QuestionType.LONG_TEXT,
      isRequired: false,
      order: 5,
      settings: { maxLength: 2000, placeholder: 'Escribe tus sugerencias…' },
    },
  });

  console.log('✅ Seed completado: encuesta-demo con preguntas y opciones.');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
