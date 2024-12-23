import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from 'zod'
import {prisma} from "../../libs/prisma"

export async function finishQuiz(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/quiz/finish', {
      schema: {
        body: z.object({
          userId: z.string(),
        })
      }
    }, async (request) => {
      const { userId } = request.body;
  
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
  
      if (!user) {
        return { message: "User not found" };
      }
  
      if (user.lifes <= 0) {
        return { message: "You lost all your lives" };
      }
  
      let newLifes = user.lifes + 1;
      if (newLifes > 5) newLifes = 5;  

      const today = new Date().toISOString();
      const lastLoginDate = user.last_login_date?.toISOString().split('T')[0];

      let newStreakCount = user.streak_count;

      if (lastLoginDate !== today.split('T')[0]) {
        newStreakCount = user.streak_count + 1;
      }
  
      await prisma.user.update({
        where: { id: userId },
        data: {
          lifes: newLifes,
          dollars: user.dollars + 10,  
          experience: user.experience + 125,
          streak_count: newStreakCount, 
          last_login_date: today
        }
      });
  
      return {
        message: "Quiz finished successfully",
        streak: user.streak_count + 1,
        dollars: user.dollars + 10,
        lifes: newLifes,
      };
    });
  }