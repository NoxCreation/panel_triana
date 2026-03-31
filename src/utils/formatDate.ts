function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  const dateFormatter = new Intl.DateTimeFormat("es-ES", options);
  return dateFormatter.format(date);
}

export { formatDate }

export function convertUTCToLocalDatetime(utcString: string) {
  const date = new Date(utcString);

  // Asegurarse de que la fecha es válida
  if (isNaN(date.getTime())) {
    throw new Error("Fecha UTC inválida");
  }

  // Obtener componentes de la fecha local
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Formatear como "YYYY-MM-DDTHH:mm"
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const getFormatDate = (startDate: Date, endDate: Date) => {
  const newDateOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  } as any

  let startDateFormat = startDate.toLocaleString("en-US", newDateOptions).split(",")[0]
  startDateFormat = `${startDateFormat.split("/")[2]}-${startDateFormat.split("/")[0]}-${startDateFormat.split("/")[1]}`
  let endDateFormat = endDate.toLocaleString("en-US", newDateOptions).split(",")[0]
  endDateFormat = `${endDateFormat.split("/")[2]}-${endDateFormat.split("/")[0]}-${endDateFormat.split("/")[1]}`

  return [startDateFormat, endDateFormat]
}

export function formatDateToUTC(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const milliseconds = date.getUTCMilliseconds();
  // Simular microsegundos (6 dígitos) añadiendo 3 ceros adicionales
  const microseconds = String(milliseconds).padEnd(6, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00`; //%2B es +
}

export function getDayRange(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();      // 0–11
  const day = date.getDate();         // 1–31

  const start = new Date(year, month, day, 0, 0, 0, 0);
  const end = new Date(year, month, day, 23, 59, 59, 999);

  return { start, end };
}

export function getUTCDayRange(startDate: Date, endDate: Date): { startUTC: Date; endUTC: Date } {
  // Usamos los métodos getUTCFullYear, getUTCMonth, etc.
  const startUTC = new Date(Date.UTC(
    startDate.getUTCFullYear(),
    startDate.getUTCMonth(),
    startDate.getUTCDate(),
    0, 0, 0, 0
  ));
  const endUTC = new Date(Date.UTC(
    endDate.getUTCFullYear(),
    endDate.getUTCMonth(),
    endDate.getUTCDate(),
    23, 59, 59, 999
  ));
  return { startUTC, endUTC };
}
