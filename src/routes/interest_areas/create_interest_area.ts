import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../libs/prisma"

export async function createInterestArea(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/interest_areas', {
        schema: {
            body: z.object({
                name: z.string().min(4)
            })
        }
    }, async(request) => {
        const {name} = request.body

        const interest_area = await prisma.interestArea.create({
            data: {
                name: name
            }
        })

        return {interest_area}
    })
}