import fastify from 'fastify';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import fastifyCors from '@fastify/cors';
import { createInterestArea } from './routes/interest_areas/create_interest_area';
import { getInterestArea } from './routes/interest_areas/list_interest_areas';
import { createUser } from './routes/user/create-user';
import { loginUser } from './routes/user/login-user';
import { sendVerificationCode } from './routes/user/send-code';
import { verifyCode } from './routes/user/verify-code';
import { createNewPassword } from './routes/user/reset-user-password';
import { startQuiz } from './routes/quiz/start-quiz';
import { submitAnswer } from './routes/quiz/submit-answer';
import { finishQuiz } from './routes/quiz/finish-quiz';
import { createCategory } from './routes/categories/create-category';
import { listCategoryById } from './routes/categories/list-category-by-id';
import { getCategories } from './routes/categories/list-category';

const app = fastify();

app.register(fastifyCors, {
    origin: '*'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createInterestArea)
app.register(getInterestArea)
app.register(createUser)
app.register(loginUser)
app.register(sendVerificationCode)
app.register(verifyCode)
app.register(createNewPassword)
app.register(startQuiz)
app.register(submitAnswer)
app.register(finishQuiz)
app.register(createCategory)
app.register(listCategoryById)
app.register(getCategories)

app.listen({
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
    console.log("HTTP Server Running!")
})