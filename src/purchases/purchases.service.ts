import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreatePurchaseDto } from './dto/CreatePurchase.dto';
import { Product } from '../Domain/Entities/Product.entity';
import { Purchase } from '../Domain/Entities/Purchase.entity';
import { PurchaseItem } from '../Domain/Entities/PurchaseItem.entity';
import { User } from '../Domain/Entities/User.entity';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase)
    private purchaseModel: typeof Purchase,
    @InjectModel(PurchaseItem)
    private purchaseItemModel: typeof PurchaseItem,
    @InjectModel(Product)
    private productModel: typeof Product,
    private sequelize: Sequelize,
  ) { }

  /**
   * Creates a new purchase for a client.
   * This method uses a transaction to ensure data integrity.
   * If any part of the purchase fails (e.g., insufficient stock), the entire transaction is rolled back.
   * @param userId The ID of the user (client) making the purchase.
   * @param createPurchaseDto The DTO containing the list of products and quantities to buy.
   * @returns The created purchase object.
   */
  async create(userId: number, createPurchaseDto: CreatePurchaseDto): Promise<Purchase> {
    const t = await this.sequelize.transaction();
    try {
      let totalPrice = 0;
      const purchasedItems: any[] = [];

      for (const item of createPurchaseDto.items) {
        const product = await this.productModel.findByPk(item.productLotNumber, { transaction: t }).then(data => {
      if (!data) {
        throw new NotFoundException(`Product with lotID "${item.productLotNumber}" not found.`);
      };
      return data.get({ plain: true })
    });

        if (!product) {
          throw new NotFoundException(`Product with lot number ${item.productLotNumber} not found.`);
        }

        if (product.quantityAvailable < item.quantity) {
          throw new BadRequestException(`Not enough stock for product ${product.lotNumber}. Available: ${product.quantityAvailable}, Requested: ${item.quantity}.`);
        }

        // Calculate the total price for this item and add it to the total purchase price
        const itemPrice = product.price * item.quantity;
        totalPrice += itemPrice;

        // Decrease the stock of the product
        await this.productModel.update(
          { quantityAvailable: product.quantityAvailable - item.quantity },
          { where: { lotNumber: product.lotNumber }, transaction: t }
        );

        // Prepare the purchase item record
        purchasedItems.push({
          productLotNumber: product.lotNumber,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });
      }

      // Create the new purchase record
      const purchase = await this.purchaseModel.create(
        {
          userId,
          totalPrice,
          purchaseDate: new Date(),
        } as Purchase,
        { transaction: t }
      );

      // Create the purchase item records and link them to the new purchase
      for (const item of purchasedItems) {
        await this.purchaseItemModel.create(
          {
            purchaseId: purchase.id,
            ...item,
          },
          { transaction: t }
        );
      }

      await t.commit();

      // Return the complete purchase object with associations
      return this.findOne(purchase.id);

    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  /**
   * Finds a purchase by its ID. Can be used for fetching a single invoice.
   * @param purchaseId The ID of the purchase.
   * @returns The purchase object with associated user and products.
   */
  async findOne(purchaseId: number): Promise<Purchase> {
    const purchase = await this.purchaseModel.findByPk(purchaseId, {
      include: [
        {
          model: User,
          attributes: ['username', 'role'], // Include client info
        },
        {
          model: PurchaseItem,
          include: [
            {
              model: Product,
              attributes: ['lotNumber', 'name', 'price'], // Include product details
            },
          ],
        },
      ],
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase with ID ${purchaseId} not found.`);
    }

    return purchase;
  }

  /**
   * Finds all purchases for a specific user (client).
   * @param userId The ID of the client.
   * @returns An array of the client's purchases.
   */
  async findByUser(userId: number): Promise<Purchase[]> {
    return this.purchaseModel.findAll({
      where: { userId },
      include: [
        {
          model: PurchaseItem,
          include: [
            {
              model: Product,
              attributes: ['lotNumber', 'name', 'price'],
            },
          ],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });
  }

  /**
   * Finds all purchases in the system. Accessible by Administrator.
   * @returns An array of all purchases.
   */
  async findAll(): Promise<Purchase[]> {
    return this.purchaseModel.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'role'],
        },
        {
          model: PurchaseItem,
          include: [
            {
              model: Product,
              attributes: ['lotNumber', 'name', 'price'],
            },
          ],
        },
      ],
      order: [['purchaseDate', 'DESC']],
    });
  }
}