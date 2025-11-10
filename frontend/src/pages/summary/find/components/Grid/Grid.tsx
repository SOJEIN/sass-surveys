import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";
import { columnsTableFindSummary } from "../../models/local/summaryFind.table-model";
import { useFindAllSummaryQuery } from "../../redux/query";

function Grid() {
  const { data, isLoading, error, isFetching, refetch } =
    useFindAllSummaryQuery();
  const loading = isLoading || isFetching;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h5" fontWeight={700}>
              Mis Encuestas
            </Typography>
            <Button
              onClick={refetch}
              size="small"
              variant="outlined"
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Refrescar
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={10}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box textAlign="center" py={10}>
              <Typography variant="h6" color="error" gutterBottom>
                Error al cargar las encuestas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                No hay conexión o hubo un error.
              </Typography>
              <Button variant="contained" onClick={refetch}>
                Reintentar
              </Button>
            </Box>
          ) : data?.length === 0 ? (
            <Box textAlign="center" py={10}>
              <Typography variant="h6" gutterBottom>
                No hay encuestas disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea tu primera encuesta para verla aquí.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={data || []}
                columns={columnsTableFindSummary}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                sx={{
                  border: "none",
                  "& .MuiDataGrid-cell": {
                    borderColor: "rgba(255,255,255,0.05)",
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    borderColor: "rgba(255,255,255,0.05)",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    borderColor: "rgba(255,255,255,0.05)",
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
}

export default Grid;
