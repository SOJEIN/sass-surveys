import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import { summaryCreateInitials } from "../models/initials/summaryCreate.initials";
import type { ISummaryCreateLocal } from "../models/local/summaryCreate.local-model";
import { summaryCreateValidationSchema } from "../models/validationSchemas/summaryCreate.validationSchemas";
import { useCreateSummaryMutation } from "../redux/query";

function SummaryCreate() {
  const [triggerCreateSummary, { isLoading }] = useCreateSummaryMutation();
  const formik = useFormik<ISummaryCreateLocal>({
    initialValues: summaryCreateInitials,
    validationSchema: summaryCreateValidationSchema,
    onSubmit: async (values) => {
      const res = await triggerCreateSummary({
        nombre: values.nombre,
        apellido: values.apellido,
        correo: values.correo,
        edad: values.edad,
        comidaFavorita: values.comidaFavorita,
        genero: values.genero,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: uuidv4(),
      });
      if (res.error) {
        alert("Error al crear el registro");
        return;
      }
      alert("Registro creado exitosamente!");
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            Registro de Persona
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Complete el formulario con los datos personales
          </Typography>

          <Box component="form" onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              id="nombre"
              name="nombre"
              label="Nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nombre && Boolean(formik.errors.nombre)}
              helperText={formik.touched.nombre && formik.errors.nombre}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              id="apellido"
              name="apellido"
              label="Apellido"
              value={formik.values.apellido}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.apellido && Boolean(formik.errors.apellido)}
              helperText={formik.touched.apellido && formik.errors.apellido}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              id="correo"
              name="correo"
              label="Correo Electrónico"
              type="email"
              value={formik.values.correo}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.correo && Boolean(formik.errors.correo)}
              helperText={formik.touched.correo && formik.errors.correo}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              id="edad"
              name="edad"
              label="Edad"
              type="number"
              value={formik.values.edad}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.edad && Boolean(formik.errors.edad)}
              helperText={formik.touched.edad && formik.errors.edad}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              id="comidaFavorita"
              name="comidaFavorita"
              label="Comida Favorita"
              value={formik.values.comidaFavorita}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.comidaFavorita &&
                Boolean(formik.errors.comidaFavorita)
              }
              helperText={
                formik.touched.comidaFavorita && formik.errors.comidaFavorita
              }
              margin="normal"
              required
            />

            <FormControl
              fullWidth
              margin="normal"
              error={formik.touched.genero && Boolean(formik.errors.genero)}
            >
              <InputLabel id="genero-label">Género</InputLabel>
              <Select
                labelId="genero-label"
                id="genero"
                name="genero"
                value={formik.values.genero}
                label="Género"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
                <MenuItem value="Otro">Otro</MenuItem>
              </Select>
              {formik.touched.genero && formik.errors.genero && (
                <FormHelperText>{formik.errors.genero}</FormHelperText>
              )}
            </FormControl>

            <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                loading={isLoading}
                disabled={formik.isSubmitting}
              >
                Registrar
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() => formik.resetForm()}
              >
                Limpiar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SummaryCreate;
