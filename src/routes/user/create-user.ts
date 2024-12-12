import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import bcrypt from 'bcrypt'
import { prisma } from "../../libs/prisma"

export async function createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users/create-account', {
        schema: {
            body: z.object({
                fullName: z.string().min(4),
                email: z.string().email(),
                phone: z.string().min(11).max(11),
                university: z.string().min(3),
                password: z.string(),
                interest_areas: z.array(z.string())
            })
        }
    }, async(request) => {
        const {fullName, email, phone, university, password, interest_areas} = request.body;

        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const interests = await prisma.interestArea.findMany({
            where: {
              name: {
                in: interest_areas
              }
            },
            select: {
              id: true 
            }
        });

        if (interests.length !== interest_areas.length) {
            return { error: "One or more intrest areas weren't found." };
        }
          
        const user = await prisma.user.create({
            data:
                {
                    name: fullName,
                    email,
                    phone,  
                    university,
                    password: hashedPassword,
                    dt_creation: new Date(),
                    experience: 0,
                    streak_count: 0,
                    last_login_date: new Date(),
                    dollars: 0,
                    lifes: 5,
                    interest_id: {
                        connect: interests.map(interest => ({ id: interest.id }))
                    }
                }
        })

        return {user}
    })
}