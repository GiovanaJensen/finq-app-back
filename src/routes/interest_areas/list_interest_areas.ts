import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../libs/prisma"

export async function getInterestArea(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/interest_areas', async() => {

        const interest_area = await prisma.interestArea.findMany();

        return {interest_area}
    })
}