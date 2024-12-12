import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../libs/prisma"

export async function getCategories(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/category', async() => {

        const category = await prisma.category.findMany();

        return {category}
    })
}