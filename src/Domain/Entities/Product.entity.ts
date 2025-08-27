import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  lotNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
    validate: {
      min: 0, // Price cannot be negative
    },
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0, // Quantity cannot be negative
    },
  })
  quantityAvailable!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  entryDate!: Date;
}
