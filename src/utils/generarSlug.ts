//slug SEO-friendly
export function generarSlug(title: string) {
    return title
        .toLowerCase() // convertir a minúsculas
        .normalize("NFD") // descomponer caracteres con acento
        .replace(/[\u0300-\u036f]/g, "") // eliminar acentos
        .replace(/[^a-z0-9\s-]/g, "") // quitar caracteres especiales
        .trim() // eliminar espacios al inicio y final
        .replace(/\s+/g, "-"); // reemplazar espacios por guiones
}