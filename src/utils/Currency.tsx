export const currencyRate: Record<string, number> = {
  USD: 1,
  IDR: 0.000064,
  JPY: 0.0067,
  SGD: 0.74,
};

// convert ke USD
export const toUSD = (price: number, currency: string): number => {
  const rate = currencyRate[currency] ?? 1;
  return price * rate;
};

// total per item
export const getItemTotalUSD = (item: any): number => {
  return Number((item.qty * toUSD(item.unitPrice, item.currency)).toFixed(2));
};

// grand total
export const getGrandTotalUSD = (items: any[]): number => {
  return Number(
    items.reduce((sum, item) => sum + getItemTotalUSD(item), 0).toFixed(2)
  );
};

// formatter biar keliatan enterprise
export const formatUSD = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
