import { Injectable } from '@nestjs/common';
import { Permission } from '../../auth/constants/permissions';
import { AuthenticatedUser } from '../../auth/types/authenticated-user.interface';
import { ensurePermission } from '../../auth/utils/authorization.util';
import { AddressEntity } from '../domain/entities/address.entity';
import { AddressDetail } from '../domain/value-objects/address-detail.vo';
import { ContactInfo } from '../domain/value-objects/contact-info.vo';
import { CreateAddressDto } from '../api/dto/create-address.dto';
import { InMemoryAddressRepository } from '../infrastructure/repositories/in-memory-address.repository';

@Injectable()
export class AddressesService {
  constructor(private readonly addressRepository: InMemoryAddressRepository) {}

  async create(dto: CreateAddressDto, user: AuthenticatedUser): Promise<AddressEntity> {
    ensurePermission(user.permissions, Permission.ADDRESSES.CREATE);

    if (dto.isDefault) {
      await this.addressRepository.clearDefaultForUser(dto.userId);
    }

    const address = AddressEntity.create(
      dto.userId,
      dto.label,
      new ContactInfo(dto.receiverName, dto.phoneNumber),
      new AddressDetail(
        dto.province,
        dto.city,
        dto.district,
        dto.street,
        dto.postalCode,
      ),
      dto.isDefault,
    );

    await this.addressRepository.save(address);
    return address;
  }

  async findByUserId(userId: string, user: AuthenticatedUser) {
    ensurePermission(user.permissions, Permission.ADDRESSES.READ);
    return this.addressRepository.findByUserId(userId);
  }

  async findOne(id: string, user: AuthenticatedUser) {
    ensurePermission(user.permissions, Permission.ADDRESSES.READ);
    return this.addressRepository.findById(id);
  }

  async clear(): Promise<void> {
    await this.addressRepository.clear();
  }
}
