import { DomainException } from '../../../../common/domain.exception';

export class ContactInfo {
  constructor(
    private readonly receiverName: string,
    private readonly phoneNumber: string,
  ) {
    if (!receiverName.trim()) {
      throw new DomainException('Receiver name is required');
    }
    if (!/^1\d{10}$/.test(phoneNumber)) {
      throw new DomainException('Phone number must be a valid mainland China mobile number');
    }
  }

  getReceiverName(): string {
    return this.receiverName;
  }

  getPhoneNumber(): string {
    return this.phoneNumber;
  }

  toJSON() {
    return {
      receiverName: this.receiverName,
      phoneNumber: this.phoneNumber,
    };
  }
}
