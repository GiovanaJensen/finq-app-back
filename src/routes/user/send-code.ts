import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { getMailClient } from "../../libs/mail";
import nodemailer from 'nodemailer'
import { Twilio } from 'twilio'; 
import { prisma } from "../../libs/prisma";

// const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function sendVerificationCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/users/send-code', {
    schema: {
      body: z.object({
        user: z.string().min(4),
      })
    }
  }, async (request) => {
    const { user } = request.body;

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

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);  

    await prisma.verificationCode.upsert({
      where: { user_id: foundUser.id },
      update: {
        code: code,
        expires_at: expiresAt
      },
      create: {
        user_id: foundUser.id,
        code: code,
        expires_at: expiresAt
      }
    });

    if (isEmail) {
      try {
        const mail = await getMailClient();

        const message = await mail.sendMail({
            from: {
                name: 'Finq Team',
                address: 'finq-app@finq.com'
            },
            to: user,
            subject: `Verification Code`,
            html: `
            <p>Your verification code is ${code}</p>
            `
        })
        return { message: "Code sent to your email", link: nodemailer.getTestMessageUrl(message) };
      } catch (err) {
        return { message: "Sorry. A problem happened and we couldn't send a code to your email" };
      }
    } else if (isPhone) {
      try {
        return { message: "Code sent to your phone" };
      } catch (err) {
        return { message: "Sorry. A problem happened and we couldn't send a code to your phone" };
      }
    }
  });
}
