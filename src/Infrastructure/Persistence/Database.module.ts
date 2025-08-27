import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/Domain/Entities/User.entity';
import { Product } from 'src/Domain/Entities/Product.entity';

@Module({
  imports: [
    // This is the recommended way to load the configuration
    // using the NestJS ConfigModule
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule available globally
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Replace 'postgres' with 'mysql' if you choose to use that database
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: configService.get<number>('DB_PORT') || 5432,
        username: configService.get<string>('DB_USERNAME') || 'your_username',
        password: configService.get<string>('DB_PASSWORD') || 'your_password',
        database: configService.get<string>('DB_DATABASE') || 'your_db_name',
        autoLoadModels: true, // Automatically loads models if they are provided
        synchronize: true, // This will create the tables automatically based on your models (useful for development)
        models: [User, Product],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
