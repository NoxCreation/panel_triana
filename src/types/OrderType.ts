import { OrderStatus } from "@/generate/prisma/enums"
import { WarehouseType } from "./WarehousesType"

export type OrderType = {
    id: string;
    orderNumber: string;
    date: string;
    warehouseId: string;
    totalUsd: string;
    exchangeRates: {
        [currency: string]: number
    },
    status: OrderStatus,
    createdById: string
    warehouse: WarehouseType,
    _count: {
        items: number
        payments: number
    }
}