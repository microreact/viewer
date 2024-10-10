export function toFixedDigits(value, digits = 2) {
  return (
    parseFloat(
      value.toFixed(digits)
    )
  );
}

export function calculatePercentage(part, whole, digits) {
  return (
    toFixedDigits(
      part / whole * 100,
      digits,
    )
  );
}
