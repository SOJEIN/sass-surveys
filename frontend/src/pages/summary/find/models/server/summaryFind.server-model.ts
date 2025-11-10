export type IFindSummaryServer = {
  slug?: string;
  title?: string;
  description?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  isPublic?: boolean;
};
