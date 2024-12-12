import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from 'zod'
import {prisma} from "../../libs/prisma"

export async function startQuiz(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/quiz/start', {
      schema: {
        body: z.object({
          userId: z.string(),
          categoryId: z.string(),
        })
      }
    }, async (request) => {
      const { userId, categoryId } = request.body;
  
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
  
      if (!user) {
        return { message: "User not found" };
      }
  
      if (user.lifes <= 0) {
        return { message: "You don't have enough lives" };
      }
  
      const questions = await prisma.question.findMany({
        where: { category_id: categoryId },
        include: {
          answer: true, 
        }
      });
  
      if (!questions.length) {
        return { message: "No questions found for this category" };
      }
  
      const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  
      return {
        message: "Quiz started",
        questions: shuffledQuestions.map((q) => ({
          question: q.question,
          answers: q.answer.map((a) => ({
            id: a.id,
            answer: a.right_answer ? "Correct" : "Incorrect",
            name: a.answer
          })),
          questionId: q.id,
        }))
      };
    });
  }  