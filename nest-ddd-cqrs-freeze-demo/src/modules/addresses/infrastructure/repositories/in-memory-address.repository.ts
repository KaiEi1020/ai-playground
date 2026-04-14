import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressEntity } from '../../domain/entities/address.entity';
import { AddressDetail } from '../../domain/value-objects/address-detail.vo';
import { ContactInfo } from '../../domain/value-objects/contact-info.vo';

interface AddressSnapshot {
  id: string;
  userId: string;
  label: string;
  contactInfo: { receiverName: string; phoneNumber: string };
  addressDetail: {
    province: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
  };
  isDefault: boolean;
  createdAt: Date;
}

@Injectable()
export class InMemoryAddressRepository {
  private readonly addresses = new Map<string, AddressSnapshot>();

  async save(address: AddressEntity): Promise<void> {
    this.addresses.set(address.id, {
      id: address.id,
      userId: address.userId,
      label: address.label,
      contactInfo: address.contactInfo.toJSON(),
      addressDetail: address.addressDetail.toJSON(),
      isDefault: address.isDefault,
      createdAt: address.createdAt,
    });
  }

  async findById(id: string): Promise<AddressEntity> {
    const snapshot = this.addresses.get(id);
    if (!snapshot) {
      throw new NotFoundException(`Address ${id} not found`);
    }

    return new AddressEntity(
      snapshot.id,
      snapshot.userId,
      snapshot.label,
      new ContactInfo(
        snapshot.contactInfo.receiverName,
        snapshot.contactInfo.phoneNumber,
      ),
      new AddressDetail(
        snapshot.addressDetail.province,
        snapshot.addressDetail.city,
        snapshot.addressDetail.district,
        snapshot.addressDetail.street,
        snapshot.addressDetail.postalCode,
      ),
      snapshot.isDefault,
      snapshot.createdAt,
    );
  }

  async findByUserId(userId: string): Promise<AddressEntity[]> {
    return Array.from(this.addresses.values())
      .filter((a) => a.userId === userId)
      .map(
        (snapshot) =>
          new AddressEntity(
            snapshot.id,
            snapshot.userId,
            snapshot.label,
            new ContactInfo(
              snapshot.contactInfo.receiverName,
              snapshot.contactInfo.phoneNumber,
            ),
            new AddressDetail(
              snapshot.addressDetail.province,
              snapshot.addressDetail.city,
              snapshot.addressDetail.district,
              snapshot.addressDetail.street,
              snapshot.addressDetail.postalCode,
            ),
            snapshot.isDefault,
            snapshot.createdAt,
          ),
      );
  }

  async clearDefaultForUser(userId: string): Promise<void> {
    for (const snapshot of this.addresses.values()) {
      if (snapshot.userId === userId) {
        snapshot.isDefault = false;
      }
    }
  }

  async clear(): Promise<void> {
    this.addresses.clear();
  }
}
