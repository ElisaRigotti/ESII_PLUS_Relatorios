import { render, screen } from "@testing-library/react";
import SummaryCards from "./SummaryCards";

const summary = {
  totalSales: 1649.2,
  totalOrders: 3,
  totalItemsSold: 8,
  averageTicket: 549.73,
  totalStockIn: 40,
  totalStockOut: 7,
};

describe("SummaryCards", () => {
  it("renders all summary indicators", () => {
    render(<SummaryCards summary={summary} loading={false} error={null} />);

    expect(screen.getByText("Total vendido")).toBeInTheDocument();
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("Itens vendidos")).toBeInTheDocument();
    expect(screen.getByText("Ticket medio")).toBeInTheDocument();
    expect(screen.getByText("Entradas no estoque")).toBeInTheDocument();
    expect(screen.getByText("Saidas do estoque")).toBeInTheDocument();
    expect(screen.getByText(/1.649,20/)).toBeInTheDocument();
    expect(screen.getByText("549,73", { exact: false })).toBeInTheDocument();
  });

  it("renders an error state", () => {
    render(<SummaryCards summary={null} loading={false} error="Erro" />);

    expect(screen.getByText(/Nao foi possivel carregar/)).toBeInTheDocument();
  });

  it("renders an empty state", () => {
    render(<SummaryCards summary={null} loading={false} error={null} />);

    expect(screen.getByText(/Nenhum indicador disponivel/)).toBeInTheDocument();
  });
});
