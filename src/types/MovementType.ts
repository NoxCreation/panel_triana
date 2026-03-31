import { ProductType } from "./ProductType";
import { UserType } from "./UserType";
import { WarehouseType } from "./WarehousesType";

export type MovementType = {
    id: string;
    product: ProductType;
    productId: string;
    quantity: number;
    warehouse: WarehouseType;
    warehouseId: string;
    previousQuantity: number;
    newQuantity: number;
    reason: string;
    type: string;
    user: UserType;
    userId: string;
}