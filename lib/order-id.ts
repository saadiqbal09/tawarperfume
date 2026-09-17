export function generateOrderId() {
  return `#TWR-${Math.floor(1000 + Math.random() * 9000)}`;
}