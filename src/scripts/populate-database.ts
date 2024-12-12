import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const category1 = await prisma.category.create({
    data: {
      name: 'Matemática',
      description: 'Perguntas sobre conceitos de matemática básica e avançada',
    }
  });

  const category2 = await prisma.category.create({
    data: {
      name: 'História',
      description: 'Perguntas sobre eventos históricos e figuras importantes',
    }
  });

  const question1 = await prisma.question.create({
    data: {
      question: 'Qual é a soma de 2 + 2?',
      level: 1,
      category_id: category1.id,
      answer: {
        create: [
          { right_answer: true, answer: "4"},
          { right_answer: false,  answer: "3"},
          { right_answer: false, answer: "44"},
          { right_answer: false,  answer: "2"},
        ]
      }
    }
  });

  const question2 = await prisma.question.create({
    data: {
      question: 'Qual é o valor de pi?',
      level: 2,
      category_id: category1.id,
      answer: {
        create: [
          { right_answer: false, answer: "3.25"},
          { right_answer: false,  answer: "3.16"},
          { right_answer: true, answer: "3.14"},
          { right_answer: false,  answer: "3.18"},
        ]
      }
    }
  });

  // 3. Criando perguntas e respostas para a categoria "História"
  const question3 = await prisma.question.create({
    data: {
      question: 'Quem foi o primeiro presidente dos Estados Unidos?',
      level: 1,
      category_id: category2.id,
      answer: {
        create: [
          { right_answer: false,  answer: "Alexander Hamilton"},
          { right_answer: false, answer: "Elisa Hamilton"},
          { right_answer: true, answer: "George Washington"},
          { right_answer: false,  answer: "Aaron Burr, sir"}
        ]
      }
    }
  });

  const question4 = await prisma.question.create({
    data: {
      question: 'Em que ano ocorreu a Revolução Francesa?',
      level: 2,
      category_id: category2.id,
      answer: {
        create: [
          { right_answer: false,  answer: "1892"},
          { right_answer: false, answer: "2024"},
          { right_answer: false,  answer: "1654"},
          { right_answer: true, answer: "1789"},
        ]
      }
    }
  });

  console.log('Banco de dados populado com categorias, perguntas e respostas!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
