import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthRequest, IAuthUser } from '@interfaces/auth.interface';
import { Role } from '@enums/role';

export class AuthMiddleware {

  static verify(level: Role = Role.MEMBER) {
    return (req: IAuthRequest, res: Response, next: NextFunction) => {
      const JWT_SECRET = process.env.JWT_SECRET || '';
      const PUBLIC_TOKEN = process.env.FRONT_PUBLIC_TOKEN || '';
      const PRIVATE_TOKEN = process.env.PRIVATE_TOKEN || '';
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header ausente.', code: 401 });
      }

      const token = authHeader.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Token ausente.', code: 401 });

      if (level === Role.PUBLIC) {
        if (token === PUBLIC_TOKEN) {
          req.user = { role: Role.PUBLIC };
          return next();
        }

        return res.status(403).json({ error: 'Acesso negado para token público.', code: 403 });
      }

      if (level === Role.PRIVATE) {
        if (token === PRIVATE_TOKEN) {
          req.user = { role: Role.PRIVATE };
          return next();
        }
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as IAuthUser;
        req.user = decoded;

        // Checagem de nível de acesso
        if ((level === Role.ADMIN || level === Role.PRIVATE) && decoded.role !== Role.ADMIN) {
          return res.status(403).json({ error: 'Acesso restrito a administradores.', code: 403 });
        }

        return next();
      } catch (err) {
        console.error('Erro ao verificar token:', err);
        return res.status(401).json({ error: 'Token JWT inválido.', code: 401 });
      }
    };
  }
}