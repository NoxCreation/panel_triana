export type ProductType = {
    id: string;
    sku: string;
    name: string;
    photo: string;
    priceUsd: string;
    costUsd: string;
    supplier: {
        id: string;
        name: string;
    }
}