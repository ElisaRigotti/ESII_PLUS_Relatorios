export interface SalesByCategoryItem {
  categoryId: string;
  categoryName: string;
  totalOrders: number;
  totalItems: number;
  totalRevenue: number;
}

export interface SalesBySizeItem {
  size: string;
  totalOrders: number;
  totalItems: number;
  totalRevenue: number;
}

export interface StockMovementSummary {
  productId: string;
  productName: string;
  totalEntradas: number;
  totalSaidas: number;
  totalAjustes: number;
  saldoAtual: number;
}

export interface ReportSummary {
  totalSales: number;
  totalOrders: number;
  totalItemsSold: number;
  averageTicket: number;
  totalStockIn: number;
  totalStockOut: number;
}

export type ReportType = "sales-by-category" | "sales-by-size" | "stock-movements";
export type ExportFormat = "csv" | "json" | "pdf";

export interface DateRangeFilter {
  startDate: string | null;
  endDate: string | null;
}