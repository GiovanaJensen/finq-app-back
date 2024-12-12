import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../libs/prisma";

export async function listCategoryById(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get('/category/:categoryId', {
        schema: {
            params: z.object({
                categoryId: z.string().uuid()
            })
        }
    }, async(request, reply) => {
        const {categoryId} = request.params;

        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if(!category) {
            throw new Error('Category not found');
        }

        return {category}
    })
}