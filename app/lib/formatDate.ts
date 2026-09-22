export default function formatDate(dateString: string): string {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(
    new Date(dateString),
  );
}
