import express from 'express';
import cors from 'cors';
import intencoesRoutes from '@routes/intencoes.routes.ts';
import authRoutes from '@routes/auth.routes.ts';
import conviteRoutes from '@routes/convite.routes.ts';
import indicacoesRoute from '@routes/indicacao.route.ts';

const app = express();
const baseURL = '/api/v1';

app.use(cors());
app.use(express.json());

app.use(`${baseURL}/intencoes`, intencoesRoutes);
app.use(`${baseURL}/auth`, authRoutes);
app.use(`${baseURL}/convites`, conviteRoutes);
app.use(`${baseURL}/indicacoes`, indicacoesRoute);

export default app;