import type { IFindSummaryLocal } from '../../models/local/summaryFind.local-model';
import type { IFindSummaryServer } from '../../models/server/summaryFind.server-model';
import { v4 as uuidv4 } from 'uuid';

export const adapterToLocalSummaryFind = (
  response: IFindSummaryServer[]
): IFindSummaryLocal[] => {
  return response.map((item) => ({
    id: uuidv4(),
    slug: item.slug ?? '',
    title: item.title ?? '',
    description: item.description ?? '',
    status: item.status ?? 'DRAFT',
    isPublic: item.isPublic ?? false
  }));
};
