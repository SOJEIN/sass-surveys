export type ICreateSummaryServerProps = {
  nombre: string;
  apellido: string;
  correo: string;
  edad: number;
  comidaFavorita: string;
  genero: "Masculino" | "Femenino" | "Otro";
  createdAt: Date;
  updatedAt: Date;
  id: string;
};
