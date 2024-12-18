import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import bcrypt from 'bcrypt'
import { prisma } from "../../libs/prisma"
import jwt from 'jsonwebtoken';

export async function listUserRanking(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/ranking', {
        schema: {
            body: z.object({
                id: z.string().uuid(),
            })
        }
    }, async(request) => {
        const {id} = request.body;

        const foundUser = await prisma.user.findUnique({
            where : {id},
            include: {
                Level: true
            }
        })

        if(!foundUser) {
            return {error: "User not found!"}
        }

        const userLevel = foundUser.Level[0]?.level

        const usersInSameLeague = await prisma.user.findMany({
            where: {
                Level: {
                    some: {
                        level: userLevel
                    },
                }
            }
        });
      
        return { users: usersInSameLeague };

    })
}