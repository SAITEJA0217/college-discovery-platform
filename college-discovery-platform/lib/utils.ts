export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "Not available";
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return typeof value === 'string' ? value : "Not available";
  if (num === 0) return "Not available"; // As requested, don't show misleading zeros
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
}
