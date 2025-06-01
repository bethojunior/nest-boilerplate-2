import { UserEntity } from 'src/shared/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      userLogged?: UserEntity;
    }
  }
}
