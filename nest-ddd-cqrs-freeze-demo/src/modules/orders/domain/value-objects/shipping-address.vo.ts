import { DomainException } from '../../../../common/domain.exception';

export class ShippingAddress {
  constructor(
    private readonly receiverName: string,
    private readonly phoneNumber: string,
    private readonly province: string,
    private readonly city: string,
    private readonly district: string,
    private readonly street: string,
    private readonly postalCode: string,
  ) {
    if (!receiverName || !phoneNumber || !province || !city || !district || !street) {
      throw new DomainException('Shipping address fields are required');
    }
    if (!/^\d{6}$/.test(postalCode)) {
      throw new DomainException('Shipping postal code must be 6 digits');
    }
  }

  toJSON() {
    return {
      receiverName: this.receiverName,
      phoneNumber: this.phoneNumber,
      province: this.province,
      city: this.city,
      district: this.district,
      street: this.street,
      postalCode: this.postalCode,
      fullAddress: `${this.province}${this.city}${this.district}${this.street}`,
    };
  }
}
