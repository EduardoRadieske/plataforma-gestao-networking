import { Router } from 'express';
import { PrismaClient } from '@prismaG/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthMiddleware } from '@middlewares/auth';
import { IAuthRequest } from '@interfaces/auth.interface';
import { Role } from '@enums/role';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /auth/register
 * - Rota privada apenas para PRIVATE_TOKEN ou ADM
 */
router.post('/register', AuthMiddleware.verify(Role.PRIVATE), async (req, res) => {
  try {
    const { nome, email, password, role } = req.body;

    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.', code: 400 });
    }

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      return res.status(400).json({ error: 'E-mail já cadastrado.', code: 400 });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role: role || Role.MEMBER,
      },
    });

    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      role: novoUsuario.role,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao registrar usuário.', code: 500 });
  }
});

/**
 * POST /auth/login
 * - Rota pública (token público obrigatório)
 */
router.post('/login', AuthMiddleware.verify(Role.PUBLIC), async (req, res) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET || '';
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.', code: 400 });
    }

    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.', code: 401 });
    }

    const valid = await bcrypt.compare(password, user.senhaHash);
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas.', code: 401 });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao autenticar usuário.', code: 500 });
  }
});

/**
 * GET /users
 * - Rota privada (JWT do usuário)
 */
router.get('/users', AuthMiddleware.verify(Role.MEMBER), async (req: IAuthRequest, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();

    const lista = usuarios.map((user) => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    }));

    return res.json(lista);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar usuários.', code: 500 });
  }
});

/**
 * GET /auth/me
 * - Rota privada (JWT do usuário)
 */
router.get('/me', AuthMiddleware.verify(Role.MEMBER), async (req: IAuthRequest, res) => {
  try {
    if (!req.user?.id) {
      return res.status(404).json({ error: 'Usuário não informado.', code: 404 });
    }
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.user?.id },
      select: { id: true, nome: true, email: true, role: true, ativo: true },
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.', code: 404 });
    }

    return res.json(usuario);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao obter informações do usuário.', code: 500 });
  }
});

/**
 * POST /auth/register/guest?token=
 * - Rota pública (token público obrigatório)
 * - Cria usuário MEMBRO a partir de um convite válido
 */
router.post('/register/guest', AuthMiddleware.verify(Role.PUBLIC), async (req, res) => {
  try {
    const conviteToken = req.query.token as string;
    const { nome, email, password } = req.body;

    if (!conviteToken) {
      return res.status(400).json({ error: 'Token de convite ausente.', code: 400 });
    }

    if (!nome || !email || !password) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.', code: 400 });
    }

    const convite = await prisma.convite.findUnique({
      where: { token: conviteToken },
      include: {
        intencao: true,
      },
    });

    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado.', code: 404 });
    }

    if (convite.usado) {
      return res.status(400).json({ error: 'Convite já foi utilizado.', code: 400 });
    }

    if (convite.expiracao < new Date()) {
      return res.status(400).json({ error: 'Convite expirado.', code: 400 });
    }

    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      return res.status(400).json({ error: 'E-mail já cadastrado.', code: 400 });
    }

    const senhaHash = await bcrypt.hash(password, 10);
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role: Role.MEMBER,
      },
    });

    await prisma.convite.update({
      where: { id: convite.id },
      data: { usado: true },
    });

    await prisma.intencaoParticipacao.update({
      where: { id: convite.idIntencao },
      data: { idUsuarioGerado: novoUsuario.id },
    });

    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      role: novoUsuario.role,
    });
  } catch (err) {
    console.error('Erro ao registrar convidado:', err);
    return res.status(500).json({ error: 'Erro interno ao registrar convidado.', code: 500 });
  }
});

export default router;