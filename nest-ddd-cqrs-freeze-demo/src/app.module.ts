import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddressesModule } from './modules/addresses/addresses.module';
import { AuthModule } from './modules/auth/auth.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    CqrsModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    AddressesModule,
    OrdersModule,
    MarketingModule,
  ],
})
export class AppModule {}
