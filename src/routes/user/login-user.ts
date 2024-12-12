import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import bcrypt from 'bcrypt'
import { prisma } from "../../libs/prisma"
import jwt from 'jsonwebtoken';

export async function loginUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users/sign-in', {
        schema: {
            body: z.object({
                user: z.string().min(4),
                password: z.string(),
            })
        }
    }, async(request) => {
        const {user, password} = request.body;

        const foundUser = await prisma.user.findFirst({
            where : {
                OR: [
                    {email: user},
                    {phone: user}
                ]
            }
        })

        if (!foundUser) {
            return { message: "User or password invalid." };
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);

        if (!isPasswordValid) {
            return { message: "User or password invalid." };
        }

        const token = jwt.sign(
            { userId: foundUser.id },   
            'seu-segredo-aqui',           
            { expiresIn: '1h' }        
        );
      
        return { user: foundUser, token };

    })
}