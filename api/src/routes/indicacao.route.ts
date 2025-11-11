import { Router } from 'express';
import { PrismaClient } from '../generated/prisma/client';
import { AuthMiddleware } from '../middlewares/auth';
import { IAuthRequest } from '../interfaces/auth.interface';
import { Role } from '../enums/role';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /indicacoes
 * Lista todas as indicações vinculadas ao usuário autenticado
 */
router.get('/', AuthMiddleware.verify(Role.MEMBER), async (req: IAuthRequest, res) => {
  try {
    const indicacoes = await prisma.indicacao.findMany({
     where: { idIndicado: Number(req.user?.id) },
      orderBy: { criadoEm: 'desc' },
    });
    return res.status(200).json(indicacoes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar indicações.', code: 500 });
  }
});

/**
 * POST /indicacoes
 * Cria uma nova indicação
 */
router.post('/', AuthMiddleware.verify(Role.MEMBER), async (req: IAuthRequest, res) => {
  try {
    const { idIndicado, contato, descricao } = req.body;

    if (!contato || !descricao) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.', code: 400 });
    }

    const novaIndicacao = await prisma.indicacao.create({
      data: {
        idIndicador: Number(req.user?.id),
        idIndicado,
        contato,
        descricao,
      },
    });

    return res.status(201).json(novaIndicacao);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao criar indicação.', code: 500 });
  }
});

/**
 * PUT /indicacoes/:id
 * Atualiza uma indicação existente (somente campos enviados)
 */
router.put('/:id', AuthMiddleware.verify(Role.MEMBER), async (req: IAuthRequest, res) => {
  try {
    const { id } = req.params;
    const { contato, descricao, status } = req.body;

    const indicacao = await prisma.indicacao.findUnique({
      where: { id: Number(id) },
    });

    if (!indicacao || indicacao.idIndicador !== req.user?.id) {
      return res.status(404).json({ error: 'Indicação não encontrada.', code: 404 });
    }

    const data: Record<string, any> = {};
    if (contato) data.contato = contato;
    if (descricao) data.descricao = descricao;
    if (status) data.status = status;

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualização informado.', code: 400 });
    }

    const atualizada = await prisma.indicacao.update({
      where: { id: Number(id) },
      data,
    });

    return res.status(200).json(atualizada);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao atualizar indicação.', code: 500 });
  }
});

/**
 * DELETE /indicacoes/:id
 * Remove uma indicação existente
 */
router.delete('/:id', AuthMiddleware.verify(Role.MEMBER), async (req: IAuthRequest, res) => {
  try {
    const { id } = req.params;

    const indicacao = await prisma.indicacao.findUnique({
      where: { id: Number(id) },
    });

    if (!indicacao || indicacao.idIndicador !== req.user?.id) {
      return res.status(404).json({ error: 'Indicação não encontrada.', code: 404 });
    }

    await prisma.indicacao.delete({
      where: { id: Number(id) },
    });

    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao remover indicação.', code: 500 });
  }
});

export default router;