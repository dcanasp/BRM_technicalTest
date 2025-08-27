import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../Domain/Entities/User.entity';
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);