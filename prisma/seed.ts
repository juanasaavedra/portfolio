import { prisma } from '../lib/prisma';

async function main() {
  await prisma.guide.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.course.deleteMany();

  await prisma.course.createMany({
    data: [
      {
        title: 'Métodos de estudio universitarios',
        description: 'Domina técnicas de organización, toma de apuntes y estrategias de evaluación pensadas para estudiantes que buscan optimizar su semestre.',
        paymentLink: 'https://pay.uno-estudiante.com/metodos'
      },
      {
        title: 'Cálculo I desde cero',
        description: 'Un acompañamiento paso a paso con ejercicios resueltos, mapas conceptuales y tutorías en vivo para dominar los límites y derivadas.',
        paymentLink: 'https://pay.uno-estudiante.com/calculo-i'
      },
      {
        title: 'Inglés académico express',
        description: 'Aprende a escribir ensayos, presentar exposiciones y participar en debates con vocabulario académico y soporte en vivo.',
        paymentLink: 'https://pay.uno-estudiante.com/ingles'
      }
    ]
  });

  await prisma.guide.createMany({
    data: [
      {
        subject: 'Matemáticas',
        title: 'Guía visual de integrales por partes',
        description: 'Diagramas intuitivos y ejercicios paso a paso para interiorizar el método.',
        price: '$35.000 COP'
      },
      {
        subject: 'Escritura',
        title: 'Plantillas para ensayos universitarios',
        description: 'Estructuras listas para usar con ejemplos y checklists de revisión.',
        price: '$28.000 COP'
      },
      {
        subject: 'Idiomas',
        title: 'Toolkit de conversación académica',
        description: 'Frases clave, ejercicios de pronunciación y rúbricas para exponer con confianza.',
        price: '$30.000 COP'
      }
    ]
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
