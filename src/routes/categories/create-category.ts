import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../libs/prisma"

export async function createCategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/category', {
        schema: {
            body: z.object({
                name: z.string().min(4),
                description: z.string().min(4)
            })
        }
    }, async(request) => {
        const {name, description} = request.body

        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        })

        return {category}
    })
}