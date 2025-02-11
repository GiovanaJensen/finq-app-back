import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../libs/prisma"

export async function createQuestion(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/question', {
        schema: {
            body: z.object({
                name: z.string().min(4),
                categoryId: z.string(),
                level: z.number().int()
            })
        }
    }, async(request) => {
        const {name, categoryId, level} = request.body;

        const question = await prisma.question.create({
            data: {
                category_id: categoryId,
                question: name,
                level: level
            }
        })

        return {question}
    })
}