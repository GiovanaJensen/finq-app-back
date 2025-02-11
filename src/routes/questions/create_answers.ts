import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../libs/prisma"

export async function createAnswer(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/answer', {
        schema: {
            body: z.object({
                rightAnswer: z.boolean(),
                name: z.string(),
                questionId: z.string()
            })
        }
    }, async(request) => {
        const {rightAnswer, name, questionId} = request.body;

        const answer = await prisma.answer.create({
            data: {
                right_answer: rightAnswer,
                answer: name,
                question_id: questionId
            }
        })

        return {answer}
    })
}