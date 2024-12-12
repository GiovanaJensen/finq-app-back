import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import bcrypt from 'bcrypt'
import { prisma } from "../../libs/prisma"

export async function createNewPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users/reset-password', {
        schema: {
            body: z.object({
                user: z.string().min(4),
                password: z.string()
            })
        }
    }, async(request) => {
        const {user, password} = request.body

        const foundUser = await prisma.user.findFirst({
            where: {
                email: user
            }
        })

        if(!foundUser) {
            return {message: "User not found"}
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await prisma.user.update({
            where: {id: foundUser.id},
            data: {password: hashedPassword}
        })

        return {message: "Password changed successfully!"}
    })
}