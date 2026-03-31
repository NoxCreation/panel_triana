import { ContainerSystem } from "@/components/ContainerSystem";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Card,
    CardBody,
    Flex,
    Stack,
    Tab,
    TabList,
    Tabs,
    useDisclosure
} from "@chakra-ui/react";
import { DetailsPersonUser } from "./components/DetailsPersonUser";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { ColumnsTableOrders } from "./TableColumns";
import { useEffect, useRef, useState } from "react";
import { OrderType } from "@/types/OrderType";
import { ColumnDef } from "@tanstack/react-table";
import { useGetProfile } from "@/hooks/useGetProfile";
import { UserType } from "@/types/UserType";
import { CustomDrawer } from "@/components/CustomDrawer";
import { ModalLiquid } from "./components/ModalLiquid";
import { useFetch } from "@/hooks/useFetch";

export default function DetailsUserIndex({
    user,
    metrics
}: {
    user: UserType;
    metrics: {
        wallet: number,
        totalOrderPending: number,
        totalOrderPartial: number,
        totalOrderPaid: number,
        payment_account: number
    }
}) {
    const [_metrics, setMetrics] = useState(metrics)
    const profile = useGetProfile();
    const isAdmin = profile ? profile.role == 'ADMIN' : true
    const { handleFetch, isLoading } = useFetch()
    const tableRef = useRef<DataTableRef<OrderType>>(null);
    const [tab, setTab] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const fetchOrders = async (data) => {
        const { page, limit, sort, search, createdAt__gte, createdAt__lte, accessToken } = data
        if (accessToken) {
            const params = new URLSearchParams();
            params.append('page', String(page)); // si tu API usa page base 1
            params.append('limit', String(limit));
            if (search) params.append('search', String(search));
            if (sort) params.append('sort', sort);
            params.append('status', tab == 0 ? "PENDING" : tab == 1 ? "PARTIALLY_PAID" : "PAID");
            params.append('createdById', user.id);
            if (createdAt__gte) params.append('createdAt__gte', String(createdAt__gte));
            if (createdAt__lte) params.append('createdAt__lte', String(createdAt__lte));
            const res = await fetch(`/api/v1/orders?${params}`, {
                headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            });
            const json = await res.json();
            return {
                data: json.data,
                meta: json.meta,
            };
        }
        return {
            data: [],
            meta: {
                "total": 0,
                "page": 1,
                "limit": 10,
                "totalPages": 1
            }
        }
    }

    const fetchMetrics = async () => {
        const response = await handleFetch(`/users/metrics/${user.id}?userId=${user.id}`, "GET")
        if (response.status == 200) {
            const metrics = await response.json()
            setMetrics(metrics)
        }
    }

    useEffect(() => {
        tableRef.current.refresh()
    }, [tab])

    return (
        <ContainerSystem navBarControl={
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Clientes</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink href='/users'>Listar</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#'>Detalles</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        }>
            <CustomDrawer
                title={"Liquidar Cuenta"}
                isOpen={isOpen}
                onClose={() => { onClose(); }}
                size="sm"
            >
                {isOpen && <ModalLiquid
                    user={user}
                    totalUsd={_metrics.payment_account}
                    onUpdate={() => {
                        onClose()
                        fetchMetrics()
                        tableRef.current.refresh()
                    }}
                />}
            </CustomDrawer>

            <Flex gap={2} flexDir={{ base: 'column', md: 'row' }}>
                <DetailsPersonUser
                    user={user}
                    metrics={_metrics}
                />

                <Stack flex={6}>
                    <Flex gap={2} flexDir={{ base: 'column', md: 'row' }}>
                        <Tabs flex={1} variant={'enclosed-colored'} colorScheme="primary" isFitted index={tab} onChange={e => setTab(e)}>
                            <TabList>
                                <Tab>
                                    Órdenes Pendientes a Cobrar
                                </Tab>
                                <Tab>
                                    Órdenes Pacialmente Cobradas
                                </Tab>
                                <Tab>
                                    Órdenes Totalmente Cobradas
                                </Tab>
                            </TabList>
                        </Tabs>
                        {isAdmin && <Button variant={'solid'} onClick={onOpen} isDisabled={_metrics.payment_account == 0}>Liquidar Cuenta</Button>}
                    </Flex>

                    <Card>
                        <CardBody>
                            <DataTable
                                ref={tableRef}
                                fetchData={({ page, limit, sort, search, createdAt__gte, createdAt__lte }) => fetchOrders({ page, limit, sort, search, createdAt__gte, createdAt__lte, accessToken: profile?.accessToken })}
                                columns={ColumnsTableOrders({
                                    onRefresh: () => {
                                        tableRef.current.setFilters({
                                            /* createdAt__gte: range[0].toISOString(),
                                            createdAt__lte: range[1].toISOString() */
                                        })
                                        /* setDate([range[0], range[1]]) */
                                        fetchMetrics()
                                    }
                                }) as ColumnDef<OrderType>[]}
                                defaultPageSize={10}
                                enableExpanding={false}
                                mode="infinite"
                            />
                        </CardBody>
                    </Card>
                </Stack>
            </Flex>
        </ContainerSystem>
    );
}