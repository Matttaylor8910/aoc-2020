export function toBinary(n): string {
  let binary = '';
  if (n < 0) {
    n = n >>> 0;
  }
  while (Math.ceil(n / 2) > 0) {
    binary = n % 2 + binary;
    n = Math.floor(n / 2);
  }
  return binary;
}