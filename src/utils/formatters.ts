/**
 * Format numbers with spaces as thousands separator (e.g. 1 320 000)
 */
export function formatNumber(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Format currency in FCFA (e.g. 1 320 000 FCFA)
 */
export function formatFCFA(amount: number): string {
  return `${formatNumber(amount)} FCFA`;
}

/**
 * Short representation (e.g. 1,2 M, 45 k)
 */
export function formatShortNumber(n: number): string {
  if (n >= 1000000) {
    return (Math.round(n / 100000) / 10).toString().replace('.', ',') + ' M';
  }
  if (n >= 1000) {
    return Math.round(n / 1000) + ' k';
  }
  return String(n);
}

/**
 * Format phone display (e.g. 07 08 12 34 48)
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.match(/.{1,2}/g)?.join(' ') || phone;
  }
  return phone;
}
