import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../libs/prisma";

export async function addUsersToLeague(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/add-users-to-league', {
        schema: {
            body: z.object({
                level: z.number().min(1),
                userIds: z.array(z.string().uuid()),
            })
        }
    }, async (request) => {
        const { level, userIds } = request.body;

        const users = await prisma.user.findMany({
            where: {
                id: { in: userIds }
            },
        });

        if (users.length !== userIds.length) {
            return { error: "Alguns usuários não foram encontrados" };
        }

        const operations = userIds.map(async (userId) => {
            const existingLevel = await prisma.level.findFirst({
                where: { user_id: userId }
            });

            if (existingLevel) {
                return prisma.level.update({
                    where: { id: existingLevel.id },
                    data: { level }
                });
            } else {
                return prisma.level.create({
                    data: {
                        level,
                        need_points: 0,
                        user_id: userId
                    }
                });
            }
        });

        await Promise.all(operations);

        return { message: "Níveis atualizados/criados com sucesso" };
    });
}