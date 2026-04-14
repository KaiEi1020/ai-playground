export type CampaignStatus = 'DRAFT' | 'ACTIVE';

export class CampaignEntity {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public status: CampaignStatus,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public activatedAt: Date | null,
    public activatedBy: string | null,
  ) {}
}
