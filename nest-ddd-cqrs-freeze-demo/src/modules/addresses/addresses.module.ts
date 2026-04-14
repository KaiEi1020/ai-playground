import { Module } from '@nestjs/common';
import { AddressesController } from './api/addresses.controller';
import { AddressesService } from './application/addresses.service';
import { InMemoryAddressRepository } from './infrastructure/repositories/in-memory-address.repository';

@Module({
  controllers: [AddressesController],
  providers: [AddressesService, InMemoryAddressRepository],
  exports: [AddressesService, InMemoryAddressRepository],
})
export class AddressesModule {}
