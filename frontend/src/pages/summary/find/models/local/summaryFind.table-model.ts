import type { GridColDef } from '@mui/x-data-grid';
import type { IFindSummaryLocal } from './summaryFind.local-model';

export const columnsTableFindSummary: GridColDef<IFindSummaryLocal>[] = [
  {
    field: 'title',
    headerName: 'Título',
    flex: 1,
    minWidth: 250
  },
  {
    field: 'slug',
    headerName: 'Slug',
    width: 180
  },
  {
    field: 'description',
    headerName: 'Descripción',
    flex: 1,
    minWidth: 200
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 130,
    valueFormatter: (value) => {
      const statusMap = {
        DRAFT: 'Borrador',
        PUBLISHED: 'Publicado',
        ARCHIVED: 'Archivado'
      };
      return statusMap[value as keyof typeof statusMap] || value;
    }
  },
  {
    field: 'isPublic',
    headerName: 'Público',
    width: 100,
    type: 'boolean'
  }
];
