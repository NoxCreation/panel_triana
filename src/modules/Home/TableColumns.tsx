import { CustomColumnDef } from "@/types/CustomColumnDef";
import { OrderType } from "@/types/OrderType";
import { Badge, Flex, IconButton, Tooltip, Text } from "@chakra-ui/react";
import { CiViewList } from "react-icons/ci";
import { NumberModalPayments } from "../Orders/components/NumberModalPayments";
import Link from "next/link";

export const ColumnsTableOrders = (): CustomColumnDef<OrderType>[] => {
    return [
        {
            accessorKey: "orderNumber",
            header: "N° Orden",
            enableSorting: true,
            cell: ({ getValue }) => <Text fontWeight="medium">{getValue<string>()}</Text>,
        },
        {
            accessorKey: "createdBy",
            header: "Usuario",
            enableSorting: true,
            cell: ({ getValue, row }) => (
                <Link href={`/users/${row.original.createdById}`}>
                    <Text fontWeight="normal" color={'primary.800'} _hover={{
                        color: 'primary.400'
                    }}>
                        {getValue<any>().first_name}  {getValue<any>().last_name}
                    </Text>
                </Link>
            ),
        },
        {
            accessorKey: "date",
            header: "Fecha",
            enableSorting: true,
            cell: ({ getValue }) => {
                const date = new Date(getValue<string>());
                return date.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                });
            },
        },
        {
            accessorKey: "warehouse.name",
            header: "Almacén",
            enableSorting: true,
        },
        {
            accessorKey: "totalUsd",
            header: "Total (USD)",
            enableSorting: true,
            cell: ({ getValue }) => (
                <Text fontWeight="bold" color="green.600">
                    ${getValue<string>()}
                </Text>
            ),
        },
        {
            accessorKey: "status",
            header: "Estado",
            enableSorting: true,
            cell: ({ getValue }) => {
                const status = getValue<string>();
                const colorScheme =
                    status === "PAID" ? "green" : status === "PARTIALLY_PAID" ? "orange" : "gray";
                const label = status === "PAID" ? "PAGADO" : status === "PARTIALLY_PAID" ? "PARCIALMENTE PAGADO" : "PENDIENTE";
                return <Badge variant={'subtle'} colorScheme={colorScheme}>{status.replace("_", " ")}</Badge>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <Flex gap={2} justifyContent="flex-end">
                    <Tooltip label="Ver detalles">
                        <NumberModalPayments orderId={row.original.id}>
                            <IconButton
                                colorScheme="primary"
                                variant="ghost"
                                size="sm"
                                aria-label="Ver detalles"
                                icon={<CiViewList />}
                            />
                        </NumberModalPayments>
                    </Tooltip>
                </Flex>
            ),
        },
    ];
};
