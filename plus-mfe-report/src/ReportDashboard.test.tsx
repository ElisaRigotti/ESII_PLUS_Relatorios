import { render, screen, waitFor } from "@testing-library/react";
import ReportDashboard from "./ReportDashboard";

const responses: Record<string, unknown> = {
  "/reports/sales/by-category": [
    {
      categoryId: "cat-festa",
      categoryName: "Moda Festa",
      totalOrders: 2,
      totalItems: 5,
      totalRevenue: 1249.5,
    },
  ],
  "/reports/sales/by-size": [
    {
      size: "52",
      totalOrders: 2,
      totalItems: 4,
      totalRevenue: 879.6,
    },
  ],
  "/reports/stock/movements": [
    {
      productId: "prod-vestido",
      productName: "Vestido Midi Plus",
      totalEntradas: 20,
      totalSaidas: 5,
      totalAjustes: 0,
      saldoAtual: 23,
    },
  ],
};

function mockFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      const path = Object.keys(responses).find((candidate) => url.includes(candidate));
      if (!path) {
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
      }

      return new Response(JSON.stringify(responses[path]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }),
  );
}

describe("ReportDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    mockFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the dashboard title and loads category report by default", async () => {
    render(<ReportDashboard />);

    expect(
      screen.getByText("Relatórios de vendas e estoque"),
    ).toBeInTheDocument();

    expect(await screen.findByText("Moda Festa")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/reports/sales/by-category"),
        expect.any(Object),
      );
    });
  });
});
