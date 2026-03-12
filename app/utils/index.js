export function toTelLink(phone) {
  if (phone) {
    return `tel:+1${phone.replace(/\D/g, "")}`;
  }
}
