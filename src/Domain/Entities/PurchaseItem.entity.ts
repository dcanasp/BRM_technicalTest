import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Purchase } from './Purchase.entity';
import { Product } from './Product.entity';

@Table({
  tableName: 'purchase_items',
  timestamps: false,
})
export class PurchaseItem extends Model<PurchaseItem> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Purchase)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  purchaseId!: number;

  @BelongsTo(() => Purchase)
  purchase!: Purchase;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productLotNumber!: string;

  @BelongsTo(() => Product)
  product!: Product;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  priceAtPurchase!: number;
}