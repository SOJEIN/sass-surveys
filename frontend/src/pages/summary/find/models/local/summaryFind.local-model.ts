export type IFindSummaryLocal = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPublic: boolean;
};
