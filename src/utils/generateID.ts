export function generateID() {
    // Tomamos la hora actual en milisegundos
    const timestamp = Date.now().toString(36);
    // Generamos un número aleatorio y lo convertimos a base 36
    const randomPart = Math.random().toString(36).substring(2, 8);
    // Combinamos ambas partes para formar el UID
    return `${timestamp}-${randomPart}`;
}