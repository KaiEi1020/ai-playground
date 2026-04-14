import { DomainException } from '../../../../common/domain.exception';

export class AddressDetail {
  constructor(
    private readonly province: string,
    private readonly city: string,
    private readonly district: string,
    private readonly street: string,
    private readonly postalCode: string,
  ) {
    if (!province || !city || !district || !street) {
      throw new DomainException('Address fields are required');
    }
    if (!/^\d{6}$/.test(postalCode)) {
      throw new DomainException('Postal code must be 6 digits');
    }
  }

  getProvince(): string {
    return this.province;
  }

  getCity(): string {
    return this.city;
  }

  getDistrict(): string {
    return this.district;
  }

  getStreet(): string {
    return this.street;
  }

  getPostalCode(): string {
    return this.postalCode;
  }

  toSingleLine(): string {
    return `${this.province}${this.city}${this.district}${this.street}`;
  }

  toJSON() {
    return {
      province: this.province,
      city: this.city,
      district: this.district,
      street: this.street,
      postalCode: this.postalCode,
    };
  }
}
