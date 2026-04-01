export enum OwnerType {
  Salon = 'salon',
  Master = 'master',
}

export type CertificateFormValues = {
  title: string;
  description: string;
  issueDate: string;
  ownerType: OwnerType;
  masterId: number | null;
};
