import { randomUUID } from 'crypto';
import { AddressDetail } from '../value-objects/address-detail.vo';
import { ContactInfo } from '../value-objects/contact-info.vo';

export class AddressEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public label: string,
    public contactInfo: ContactInfo,
    public addressDetail: AddressDetail,
    public isDefault: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(
    userId: string,
    label: string,
    contactInfo: ContactInfo,
    addressDetail: AddressDetail,
    isDefault: boolean,
  ): AddressEntity {
    return new AddressEntity(
      randomUUID(),
      userId,
      label,
      contactInfo,
      addressDetail,
      isDefault,
      new Date(),
    );
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      label: this.label,
      contactInfo: this.contactInfo.toJSON(),
      addressDetail: this.addressDetail.toJSON(),
      fullAddress: this.addressDetail.toSingleLine(),
      isDefault: this.isDefault,
      createdAt: this.createdAt,
    };
  }
}
