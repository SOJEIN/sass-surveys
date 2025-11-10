import * as Yup from 'yup';

export const summaryCreateValidationSchema = Yup.object({
  nombre: Yup.string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),

  apellido: Yup.string()
    .required('El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),

  correo: Yup.string()
    .required('El correo es requerido')
    .email('Debe ser un correo válido'),

  edad: Yup.number()
    .required('La edad es requerida')
    .positive('La edad debe ser positiva')
    .integer('La edad debe ser un número entero')
    .min(1, 'La edad debe ser al menos 1')
    .max(120, 'La edad no puede ser mayor a 120'),

  comidaFavorita: Yup.string()
    .required('La comida favorita es requerida')
    .min(2, 'La comida favorita debe tener al menos 2 caracteres')
    .max(100, 'La comida favorita no puede exceder 100 caracteres'),

  genero: Yup.string()
    .required('El género es requerido')
    .oneOf(['Masculino', 'Femenino', 'Otro'], 'Seleccione un género válido')
});
