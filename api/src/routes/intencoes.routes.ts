import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth';
import { IAuthRequest } from '../interfaces/auth.interface';
import { Role } from '../enums/role';
import crypto from 'crypto';
import { PrismaClient, StatusIntencao } from '../generated/prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /intencoes
 * - Rota pública (token padrão no Authorization)
 */
router.post('/', AuthMiddleware.verify(Role.PUBLIC), async (req, res) => {
  try {
    const { nome, email, empresa, mensagem } = req.body;
    if (!nome || !email || !empresa) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.', code: 400 });
    }

    const novaIntencao = await prisma.intencaoParticipacao.create({
      data: { nome, email, empresa, mensagem },
    });

    return res.status(201).json(novaIntencao);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar intenção.', code: 500 });
  }
});

/**
 * GET /intencoes
 * - Apenas administradores
 */
router.get('/', AuthMiddleware.verify(Role.ADMIN), async (req: IAuthRequest, res) => {
  try {
    const intencoes = await prisma.intencaoParticipacao.findMany({
      orderBy: { criadoEm: 'desc' },
    });
    return res.json(intencoes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar intenções.', code: 500 });
  }
});

/**
 * PUT /intencoes/:id/aprovar
 *  - Apenas administradores
 */
router.put('/:id/aprovar', AuthMiddleware.verify(Role.ADMIN), async (req: IAuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(404).json({ error: 'Usuário responsável não informado.', code: 404 });
    }

    const { id } = req.params;
    const atualizada = await prisma.intencaoParticipacao.update({
      where: { id: Number(id) },
      data: {
        status: StatusIntencao.APROVADA,
        idUsuarioAprov: req.user?.id,
      },
    });

    const token = crypto.randomUUID();

    await prisma.convite.create({
      data: {
        token,
        intencao: {
          connect: { id: atualizada.id },
        },
      }
    });

    console.log(`Convite gerado: http://localhost:4000/convidado?token=${token}`);

    return res.json(atualizada);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao aprovar intenção.', code: 500 });
  }
});

/**
 * PUT /intencoes/:id/recusar
 * - Apenas administradores
 */
router.put('/:id/recusar', AuthMiddleware.verify(Role.ADMIN), async (req: IAuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(404).json({ error: 'Usuário responsável não informado.', code: 404 });
    }
    
    const { id } = req.params;
    const atualizada = await prisma.intencaoParticipacao.update({
      where: { id: Number(id) },
      data: { status: StatusIntencao.RECUSADA, idUsuarioAprov: req.user?.id },
    });
    return res.json(atualizada);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao recusar intenção.', code: 500 });
  }
});

export default router;