import { IsBoolean, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateAddressDto {
  @IsUUID()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  receiverName!: string;

  @Matches(/^1\d{10}$/)
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  province!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  district!: string;

  @IsString()
  @IsNotEmpty()
  street!: string;

  @Matches(/^\d{6}$/)
  postalCode!: string;

  @IsBoolean()
  isDefault!: boolean;
}
