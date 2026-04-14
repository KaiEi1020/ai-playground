import { IsString, Length } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsString()
  @Length(1, 500)
  description!: string;
}
