import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../Domain/Entities/User.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({
      where: { username: username },
    }).then(data => {
      if (!data) {
        throw new NotFoundException(`User with username "${username}" not found.`);
      };
      return data.get({ plain: true })
    })


  }



  async create(user: Partial<User>): Promise<User> {
    if (user.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
    }
    return this.userModel.create(user as User);
  }
}