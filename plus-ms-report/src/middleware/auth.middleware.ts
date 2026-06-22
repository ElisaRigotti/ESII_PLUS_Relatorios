import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface AuthenticatedUser {
  email: string;
  userId: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Middleware de autenticação.
 *
 * O MS Auth (Grupo 7) emite JWT HS256 com payload:
 *   { sub: email, user_id: string, role: 'admin' | 'vendedor' | 'gestor' }
 *
 * Se JWT_SECRET estiver configurado e vier um Bearer token, valida o JWT real.
 * Caso contrário, cai no fallback de desenvolvimento: aceita os headers
 * x-user-email e x-user-role para simular um usuário autenticado.
 */
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (config.jwtSecret && authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length);

    try {
      const payload = jwt.verify(token, config.jwtSecret) as {
        sub: string;
        user_id: string;
        role: string;
      };

      req.user = {
        email: payload.sub,
        userId: payload.user_id,
        role: payload.role,
      };

      return next();
    } catch {
      res.status(401).json({ error: 'Token JWT invalido ou expirado' });
      return;
    }
  }

  // Fallback de desenvolvimento: headers simulados
  const devEmail = req.headers['x-user-email'] as string | undefined;
  const devRole = req.headers['x-user-role'] as string | undefined;

  if (devEmail && devRole) {
    req.user = {
      email: devEmail,
      userId: devEmail,
      role: devRole,
    };
    return next();
  }

  res.status(401).json({ error: 'Nao autenticado' });
}

/**
 * Middleware de autorizacao por role.
 * Uso: requireRole('admin', 'gestor')
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Nao autenticado' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Acesso negado. Roles permitidas: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
}