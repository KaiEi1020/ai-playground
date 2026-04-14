export class CampaignResponseDto {
  id!: string;
  name!: string;
  description!: string;
  status!: 'DRAFT' | 'ACTIVE';
  createdBy!: string;
  createdAt!: Date;
  activatedAt!: Date | null;
  activatedBy!: string | null;
}
