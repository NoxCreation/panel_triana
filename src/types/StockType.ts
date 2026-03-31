import { ProductType } from "./ProductType";
import { WarehouseType } from "./WarehousesType";

export type StockType = {
    id: string;
    product: ProductType;
    productId: string;
    quantity: number;
    warehouse: WarehouseType;
    warehouseId: string;
}