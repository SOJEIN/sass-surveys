import type { IFindSummaryLocal } from "../../models/local/summaryFind.local-model";
import type { IFindSummaryServer } from "../../models/server/summaryFind.server-model";

export const adapterToLocalSummaryFind = (
  response: IFindSummaryServer[]
): IFindSummaryLocal[] => {
  return response.map((item) => ({
    nombre: item.nombre,
    apellido: item.apellido,
    correo: item.correo,
    edad: item.edad,
    comidaFavorita: item.comidaFavorita,
    genero: item.genero,
    createdAt: new Date(item.createdAt),
    updatedAt: new Date(item.updatedAt),
    id: item.id,
  }));
};
