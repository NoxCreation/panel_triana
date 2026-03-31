import { ColumnDef } from "@tanstack/react-table";

export type CustomColumnDef<TData = any> = ColumnDef<TData> & {
    sticky?: 'left' | 'right' | boolean;
}