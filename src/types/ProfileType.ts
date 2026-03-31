export interface ProfileJWTType {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    image: null | string;
    role: "ADMIN" | "";
    accessToken: string,
}