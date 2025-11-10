export type ISummaryCreateLocal = {
  id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  edad: number;
  comidaFavorita: string;
  genero: 'Masculino' | 'Femenino' | 'Otro';
  createdAt?: string;
  updatedAt?: string;
};
