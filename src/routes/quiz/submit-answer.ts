import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod"
import {prisma} from '../../libs/prisma'

export async function submitAnswer(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/quiz/submit', {
      schema: {
        body: z.object({
          userId: z.string(),
          questionId: z.string(),
          answerId: z.string(),
        })
      }
    }, async (request) => {
      const { userId, questionId, answerId } = request.body;
  
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
  
      if (!user) {
        return { message: "User not found" };
      }
  
      const answer = await prisma.answer.findUnique({
        where: { id: answerId }
      });
  
      if (!answer) {
        return { message: "Answer not found" };
      }
  
      const isCorrect = answer.right_answer;
  
      if (!isCorrect) {
        await prisma.user.update({
          where: { id: userId },
          data: { lifes: user.lifes - 1 }
        });
      }
  
      await prisma.results.create({
        data: {
          user_id: userId,
          question_id: questionId,
          answer_id: answerId,
          score: isCorrect ? 1 : 0,
          dt_answer: new Date(),
          time: 2
        }
      });
  
      return { message: isCorrect ? "Correct answer" : "Incorrect answer" };
    });
  }  