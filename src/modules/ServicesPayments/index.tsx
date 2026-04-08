import { ContainerSystem } from "@/components/ContainerSystem";
import { useGetProfile } from "@/hooks/useGetProfile";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Card,
    CardBody,
    CardHeader,
    Flex,
    Heading,
    Stack,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { useRef, useState } from "react";
import { ColumnsTable } from "./TableColumns";
import { ColumnDef } from "@tanstack/react-table";
import { UserType } from "@/types/UserType";
import { InputSearchSimple } from "@/components/InputSearchSimple";
import { CustomDrawer } from "@/components/CustomDrawer";
import { FormPaymentHistory } from "./FormPaymentHistory";
import { PaymentStatus } from "@/generate/prisma/enums";
import { ServiceDetails } from "./ServiceDetails";
import { ServiceType } from "@/types/ServiceType";

export default function ServicesPaymentsIndex() {
    const profile = useGetProfile();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenService, onOpen: onOpenService, onClose: onCloseService } = useDisclosure()
    const tableRef = useRef<DataTableRef<UserType>>(null);

    // Función fetchData que llama a la API
    const fetchServicesPayments = async ({ page, limit, sort, search, accessToken }) => {
        if (accessToken) {
            const params = new URLSearchParams();
            params.append('page', String(page)); // si tu API usa page base 1
            params.append('limit', String(limit));
            if (search) params.append('search', String(search));
            if (sort) params.append('sort', sort);
            const res = await fetch(`/api/v1/services_payments?${params}`, {
                headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            });
            if (res.status == 200) {
                const json = await res.json();
                /* console.log(json) */
                return {
                    data: json.data,
                    meta: json.meta,
                };
            }
            else {
                toast({
                    title: "Error cargando datos",
                    variant: "subtle",
                    description: "Hubo un error al cargar los datos, por favor intenta de nuevo.",
                    status: "error",
                    position: "top-right",
                })
            }
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

    const [history, setHistory] = useState([] as Array<{
        description: string;
        status: PaymentStatus;
        createdAt: string;
    }>);
    const handleViewHistory = (register: any) => {
        setHistory(register.history);
        onOpen();
    }

    const [service, setService] = useState({} as ServiceType);
    const handleViewService = (register: any) => {
        setService(register.service);
        onOpenService();
    }

    const handleChangeActive = async (register: any) => {
        const res = await fetch(`/api/v1/services_payments/${register.id}`, {
            body: JSON.stringify({ active: String(!register.active) }),
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${profile.accessToken}`
            }
        });
        if(res.status == 200){
            toast({
                title: "Pago actualizado",
                variant: "subtle",
                description: "El pago ha sido actualizado correctamente.",
                status: "success",
                position: "top-right",
            })
            tableRef.current?.refresh();
        }
    }

    return (
        <ContainerSystem navBarControl={
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Pagos de Servicios</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='/services_payments'>Listar</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        }>
            <CustomDrawer
                title={"Historial de Pagos"}
                isOpen={isOpen}
                onClose={() => { onClose(); }}
                size="sm"
            >
                <FormPaymentHistory history={history} />
            </CustomDrawer>

            <CustomDrawer
                title={"Detalles del Servicio"}
                isOpen={isOpenService}
                onClose={() => { onCloseService(); }}
                size="sm"
            >
                <ServiceDetails service={service} />
            </CustomDrawer>

            <Stack spacing={2}>

                <Card variant={'table'}>
                    <CardHeader display={"flex"} alignItems={{ base: "inherit", md: "center" }} flexDir={{ base: "column", md: 'row' }}>
                        <Heading size='md' flex={1}>Pagos de Servicios</Heading>
                        <Stack alignItems={'end'}>
                            <Flex>
                                <InputSearchSimple
                                    onSearch={(search) => {
                                        tableRef.current?.setFilters({ search });
                                    }}
                                    borderRightRadius={'0'}
                                />
                            </Flex>
                        </Stack>
                    </CardHeader>
                    <CardBody>
                        <Stack>
                            <DataTable
                                ref={tableRef}
                                fetchData={({ page, limit, sort, search }) => fetchServicesPayments({ page, limit, sort, search, accessToken: profile?.accessToken })}
                                columns={ColumnsTable({
                                    onViewHistory: handleViewHistory,
                                    onChangeActive: handleChangeActive,
                                    onViewService: handleViewService
                                }) as ColumnDef<UserType>[]}
                                defaultPageSize={10}
                                enableExpanding={false}
                                mode="infinite"
                            />
                        </Stack>
                    </CardBody>
                </Card>

            </Stack>
        </ContainerSystem>
    );
}
