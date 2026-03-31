export function isBase64(string: string) {
    if (string)
        return string.includes("base64");
    return false
}
