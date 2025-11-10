import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const surveyResponsesData = [
  { name: 'Ene', respuestas: 145, completadas: 120 },
  { name: 'Feb', respuestas: 230, completadas: 200 },
  { name: 'Mar', respuestas: 310, completadas: 280 },
  { name: 'Abr', respuestas: 280, completadas: 250 },
  { name: 'May', respuestas: 420, completadas: 380 },
  { name: 'Jun', respuestas: 390, completadas: 360 }
];

const statusData = [
  { name: 'Publicadas', value: 18, color: '#10b981' },
  { name: 'Borradores', value: 4, color: '#64748b' },
  { name: 'Archivadas', value: 2, color: '#ef4444' }
];

const satisfactionData = [
  { categoria: 'Excelente', cantidad: 450 },
  { categoria: 'Bueno', cantidad: 320 },
  { categoria: 'Regular', cantidad: 180 },
  { categoria: 'Malo', cantidad: 50 }
];

function Graphics() {
  const stats = [
    {
      title: 'Total Encuestas',
      value: '24',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: '#6366f1',
      change: '+12%'
    },
    {
      title: 'Respuestas Totales',
      value: '1,284',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
      change: '+8%'
    },
    {
      title: 'Tasa de Respuesta',
      value: '78%',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#ec4899',
      change: '+5%'
    }
  ];
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={700} mb={4}>
        Dashboard Consolidado
      </Typography>

      {/* Tarjetas de estadísticas */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Box key={stat.title} sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background:
                    'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 24px ${stat.color}33`
                  }
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}22`,
                        color: stat.color,
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex'
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="body2" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Box display="flex" alignItems="baseline" gap={1}>
                        <Typography variant="h4" fontWeight={700}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" color="success.main">
                          {stat.change}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        ))}
      </Stack>

      {/* Gráficas */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mb={3}>
        {/* Gráfica de Respuestas por Mes */}
        <Box flex={2}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Respuestas por Mes
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={surveyResponsesData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.1)"
                    />
                    <XAxis dataKey="name" stroke="#cbd5e1" />
                    <YAxis stroke="#cbd5e1" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="respuestas"
                      fill="#6366f1"
                      name="Respuestas"
                    />
                    <Bar
                      dataKey="completadas"
                      fill="#10b981"
                      name="Completadas"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        {/* Gráfica de Estado de Encuestas */}
        <Box flex={1}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Card
              sx={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Estado de Encuestas
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Stack>

      {/* Gráfica de Satisfacción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <Card
          sx={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Nivel de Satisfacción Consolidado
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={satisfactionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="categoria" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#ec4899"
                  strokeWidth={3}
                  name="Respuestas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default Graphics;
