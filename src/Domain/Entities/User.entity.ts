import { Table, Column, Model, DataType } from 'sequelize-typescript';

// Enums are a good way to manage roles
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
}