import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from 'zod';
import {prisma} from '../../libs/prisma';

export async function verifyCode(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users/verify-code', {
      schema: {
        body: z.object({
          user: z.string().min(4),
          code: z.string().length(6),  
        })
      }
    }, async (request) => {
      const { user, code } = request.body;
  
      const isEmail = user.includes('@');
      const isPhone = /^[0-9]{10,15}$/.test(user); 
  
      if (!isEmail && !isPhone) {
        return { message: "Email or phone invalid" };
      }
  
      const foundUser = await prisma.user.findFirst({
        where: isEmail ? { email: user } : { phone: user }
      });
  
      if (!foundUser) {
        return { message: "User not found." };
      }
  
      const verificationCode = await prisma.verificationCode.findFirst({
        where: { user_id: foundUser.id }
      });
  
      if (!verificationCode) {
        return { message: "No verification code found." };
      }
  
      const currentTime = new Date();
      if (verificationCode.code !== code || currentTime > verificationCode.expires_at) {
        return { message: "Invalid or expired code." };
      }
  

      await prisma.verificationCode.delete({
        where: { id: verificationCode.id }
      });
  
      return { message: "Code verified successfully!" };
    });
  }  