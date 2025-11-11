import { Router } from 'express';
import { PrismaClient } from '@prismaG/client.ts';
import { AuthMiddleware } from '@middlewares/auth.ts';
import { Role } from '@enums/role.ts';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /convites/validar/:token
 * - Valida um token de convite e retorna os dados básicos da intenção associada.
 * - Rota pública (usa o token padrão no Authorization)
 */
router.get('/validar/:token', AuthMiddleware.verify(Role.PUBLIC), async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: 'Token não informado.', code: 400 });
    }

    const convite = await prisma.convite.findUnique({
      where: { token }
    });

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado.', code: 404 });
    }

    if (convite.usado) {
      return res.status(400).json({ error: 'Este convite já foi utilizado.', code: 400 });
    }

    if (convite.expiracao < new Date()) {
      return res.status(400).json({ error: 'Este convite expirou.', code: 400 });
    }

    return res.status(200).json({
      valido: true
    });
  } catch (err) {
    console.error('Erro ao validar convite:', err);
    return res.status(500).json({ error: 'Erro interno ao validar convite.', code: 500 });
  }
});

export default router;