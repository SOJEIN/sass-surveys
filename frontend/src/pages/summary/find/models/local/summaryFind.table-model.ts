import type { GridColDef } from "@mui/x-data-grid";
import type { IFindSummaryLocal } from "./summaryFind.local-model";

export const columnsTableFindSummary: GridColDef<IFindSummaryLocal>[] = [
  {
    field: "nombre",
    headerName: "Nombre",
    flex: 1,
    minWidth: 250,
  },
  {
    field: "apellido",
    headerName: "Apellido",
    flex: 1,
    minWidth: 250,
  },
  {
    field: "correo",
    headerName: "Correo",
    flex: 1,
    minWidth: 250,
  },
  {
    field: "edad",
    headerName: "Edad",
    type: "number",
    flex: 0.5,
    minWidth: 100,
  },
  {
    field: "comidaFavorita",
    headerName: "Comida Favorita",
    flex: 1,
    minWidth: 200,
  },
  {
    field: "genero",
    headerName: "Género",
    flex: 0.7,
    minWidth: 150,
  },
];
