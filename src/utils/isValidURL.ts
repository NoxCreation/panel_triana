export function isValidURL(string: string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' + // protocolo
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // nombre de dominio
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // dirección IP (v4) 
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // puerto y ruta
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // cadena de consulta
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragmento de anclaje
    return !!urlPattern.test(string);
}