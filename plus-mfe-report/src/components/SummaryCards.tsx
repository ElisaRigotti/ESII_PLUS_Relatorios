import {
  Alert,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { ReportSummary } from "../types/report";

interface Props {
  summary: ReportSummary | null;
  loading: boolean;
  error: string | null;
}

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function SummaryCards({ summary, loading, error }: Props) {
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Nao foi possivel carregar os indicadores do periodo.
      </Alert>
    );
  }

  if (loading && !summary) {
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Skeleton variant="rounded" height={112} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!summary) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Nenhum indicador disponivel para o periodo selecionado.
      </Alert>
    );
  }

  const cards = [
    {
      label: "Total vendido",
      value: currency.format(summary.totalSales),
      icon: <AttachMoneyIcon color="primary" />,
    },
    {
      label: "Pedidos",
      value: String(summary.totalOrders),
      icon: <ReceiptLongIcon color="primary" />,
    },
    {
      label: "Itens vendidos",
      value: String(summary.totalItemsSold),
      icon: <ShoppingBasketIcon color="primary" />,
    },
    {
      label: "Ticket medio",
      value: currency.format(summary.averageTicket),
      icon: <InventoryIcon color="primary" />,
    },
    {
      label: "Entradas no estoque",
      value: String(summary.totalStockIn),
      icon: <ArrowUpwardIcon color="success" />,
    },
    {
      label: "Saidas do estoque",
      value: String(summary.totalStockOut),
      icon: <ArrowDownwardIcon color="error" />,
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={4} key={card.label}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent>
              {card.icon}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {card.label}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
