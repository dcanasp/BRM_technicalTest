import { Table, Column, Model, DataType, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'Administrator',
  CLIENT = 'Client',
}

@Table({
  tableName: 'users',
  timestamps: true, // Sequelize will automatically manage 'createdAt' and 'updatedAt'
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string; // In a real application, you would store a hashed password

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.CLIENT, // Default role is Client
    allowNull: false,
  })
  role!: UserRole;

  // async hashPassword(instance: User) {
  //   // Añadir una comprobación para asegurar que la contraseña no sea nula o indefinida
  //   if (instance.changed('password') && instance.password) {
  //     const salt = await bcrypt.genSalt();
  //     instance.password = await bcrypt.hash(instance.password, salt);
  //   }
  // }

  // Método de instancia para validar la contraseña
  static async validatePassword(password: string, user: User): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }
}
