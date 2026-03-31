import { ProductType } from "@/types/ProductType";
import { StockType } from "@/types/StockType";
import { WarehouseType } from "@/types/WarehousesType";
import { create } from "zustand";

type OrderViewStore = {
    cart: {
        items: Array<{
            product: ProductType;
            quantity: number
        }>
    };
    addProductToCart: (item: {
        product: ProductType;
        quantity?: number
    }, toast?: any) => void
    removeProductOfCart: (index: number) => void
    clearCart: () => void;
    warehousesSelect: string;
    setWarehousesSelect: (warehousesSelect: string) => void;
    warehouses: Array<WarehouseType>;
    setWarehouses: (warehouses: Array<WarehouseType>) => void;
    stock: Array<StockType>;
    setStock: (stock: Array<StockType>) => void;
    updateStock: (page: number, limit: number, handleFetch: any) => void
}

export const useOrderView = create<OrderViewStore>((set, get) => ({
    cart: {
        items: []
    },
    addProductToCart: (item: {
        product: ProductType,
        quantity?: number
    }, toast?: any) => {
        const items = get().cart.items

        if (item.quantity) { // se introdujo la cantidad exacto
            const searchIndex = items.findIndex(e => e.product.id == item.product.id)
            if (searchIndex != -1)  // Ya se ha agregado con anterioridad
                items[searchIndex].quantity = item.quantity
            else  // Es la primera vez que se introduce
                items.push({
                    product: item.product,
                    quantity: item.quantity
                })
        }
        else { // no se introdujo la cantidad exacta
            const searchIndex = items.findIndex(e => e.product.id == item.product.id)
            if (searchIndex != -1)  // Ya se ha agregado con anterioridad
                items[searchIndex].quantity += 1
            else // Es la primera vez que se introduce
                items.push({
                    product: item.product,
                    quantity: 1
                })
        }
        if (toast)
            toast({
                title: "Producto Agregado",
                status: 'success',
                variant: 'subtle',
                position: 'top-right'
            })
        set(() => ({
            cart: {
                items
            }
        }))
    },
    removeProductOfCart: (index: number) => {
        console.log("A", get().cart.items.splice(index, 1))
        set({
            cart: {
                items: get().cart.items.splice(index, 1)
            }
        })
    },
    clearCart: () => {
        set(() => ({ cart: { items: [] } }))
    },
    warehousesSelect: "",
    setWarehousesSelect: (warehousesSelect: string) => {
        get().clearCart()
        set(() => ({ warehousesSelect }))
    },
    warehouses: [],
    setWarehouses: (warehouses: Array<WarehouseType>) => {
        set(() => ({ warehouses }))
    },
    stock: [],
    setStock: (stock: Array<StockType>) => {
        set(() => ({ stock }))
    },
    updateStock: async (page: number, limit: number, handleFetch: any) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        params.append('warehouseId', get().warehousesSelect);
        const res = await handleFetch(`/stock?${params}`, "GET");

        if (res.status == 200) {
            const json = await res.json();
            get().setStock(json.data)
            return json.meta
        }
        else
            return null
    }
}))