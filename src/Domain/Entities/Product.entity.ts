import { Table, Column, Model, DataType, PrimaryKey, HasMany } from 'sequelize-typescript';
import { PurchaseItem } from './PurchaseItem.entity';

@Table({
  tableName: 'products',
  timestamps: true,
})
export class Product extends Model<Product> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
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
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0, // Quantity cannot be negative
    },
  })
  quantityAvailable!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  entryDate!: Date;

  @HasMany(() => PurchaseItem)
  purchaseItems!: PurchaseItem[];
}
