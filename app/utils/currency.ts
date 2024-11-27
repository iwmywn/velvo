interface Product {
  priceCents: number;
  quantity: number;
}

function totalPriceCents(products: Product[]): number {
  return products.reduce(
    (total, product) => total + product.priceCents * product.quantity,
    0,
  );
}

function formatCurrency(priceCents: number) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

export { totalPriceCents, formatCurrency };
