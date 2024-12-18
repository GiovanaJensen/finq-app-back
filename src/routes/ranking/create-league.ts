import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../libs/prisma";

export async function addUsersToLeague(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/add-users-to-league', {
        schema: {
            body: z.object({
                level: z.number().min(1),  // Identificador da liga (por exemplo: 1 para Bronze, 2 para Prata, etc.)
                userIds: z.array(z.string().uuid()),  // Lista de IDs dos usuários a serem atribuídos a essa liga
            })
        }
    }, async (request) => {
        const { level, userIds } = request.body;

        // Verificar se os usuários existem
        const users = await prisma.user.findMany({
            where: {
                id: { in: userIds }  // Verificar se todos os usuários existem no banco
            }
        });

        if (users.length !== userIds.length) {
            return { error: "Alguns usuários não foram encontrados" };
        }

        // Criar um nível (Level) para cada usuário
        const createdLevels = await prisma.level.createMany({
            data: userIds.map(userId => ({
                level,  // O mesmo nível (liga)
                need_points: 0,  // Pode definir os pontos necessários ou deixar como 0, dependendo da sua lógica
                user_id: userId  // Associando o usuário a essa liga
            })),
        });

        return { createdLevels };
    });
}