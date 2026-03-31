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
    IconButton,
    Stack,
    useDisclosure,
} from "@chakra-ui/react";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { useRef, useState } from "react";
import { ColumnsTable } from "./TableColumns";
import { ColumnDef } from "@tanstack/react-table";
import { CurrencyType } from "@/types/CurrencyType";
import { InputSearchSimple } from "@/components/InputSearchSimple";
import { FiPlus } from "react-icons/fi";
import { CustomDrawer } from "@/components/CustomDrawer";
import { CrudDrawer } from "@/components/SimpleCrud/Form/CrudDrawer";
import { FormCurrency } from "./FormUser";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useFetch } from "@/hooks/useFetch";

export default function CurrenciesIndex() {
    const profile = useGetProfile();
    const { isOpen, onOpen, onClose } = useDisclosure()

    const tableRef = useRef<DataTableRef<CurrencyType>>(null);
    const [fieldEdit, setFieldEdit] = useState(undefined)
    const { handleFetch } = useFetch()

    // Función fetchData que llama a la API
    const fetchCurrencies = async ({ page, limit, sort, search, accessToken }) => {
        if (accessToken) {
            const params = new URLSearchParams();
            params.append('page', String(page)); // si tu API usa page base 1
            params.append('limit', String(limit));
            if (search) params.append('search', String(search));
            if (sort) params.append('sort', sort);
            const res = await fetch(`/api/v1/currencies?${params}`, {
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

    // Funcion para eliminar
    const handleDelete = (card: CurrencyType) => {
        withReactContent(Swal).fire({
            title: "¿Estás seguro?",
            text: "¿Estás seguro de querer eliminar este registro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Si, ¡Elimínalo!",
            preConfirm: async () => {
                Swal.showLoading()

                const response = await handleFetch(
                    `/currencies/${card.id}`,
                    'DELETE'
                )
                if (response.status === 204) {
                    tableRef.current.refresh()
                    withReactContent(Swal).fire({
                        text: "¡Registro eliminado satisfactoriamente!",
                        icon: "success",
                    })
                } else {
                    const errorData = await response.json()
                    withReactContent(Swal).fire({
                        title: "Error!",
                        text: errorData.error || "Hubo un error al eliminar el campo.",
                        icon: "error",
                    })
                }

                Swal.hideLoading()
            },
        })
    }

    const handleEdit = (card: CurrencyType) => {
        setFieldEdit(card)
        setTimeout(() => onOpen(), 50)
    }

    const handleCreate = () => {
        setFieldEdit(undefined)
        setTimeout(() => onOpen(), 50)
    }

    return (
        <ContainerSystem navBarControl={
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Monedas</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='/currencies'>Listar</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        }>
            <CustomDrawer
                title={fieldEdit ? "Editar Moneda" : "Crear Moneda"}
                isOpen={isOpen}
                onClose={() => { onClose(); }}
                size="sm"
            >
                <CrudDrawer
                    fields={[
                        { name: "code", label: 'Codigo', default: "", type: "string" },
                        { name: "name", label: 'Nombre', default: "", type: "string" },
                        { name: "exchangeRateToUsd", label: 'Valor de Cambio', default: "", type: "string" },
                        { name: "isLocal", label: 'Es Local', default: false, type: "boolean" },
                        { name: "isCardOnly", label: 'Usada Solo en Tarjeta', default: false, type: "boolean" },
                    ]}
                    initialice={fieldEdit}
                    endpoint={"/currencies"}
                    onClose={() => { onClose(); tableRef.current.refresh(); }}
                    FieldComponent={FormCurrency}
                />
            </CustomDrawer>

            <Stack spacing={2}>

                <Card variant={'table'}>
                    <CardHeader display={"flex"} alignItems={"center"}>
                        <Heading size='md' flex={1}>Monedas</Heading>
                        <Stack alignItems={'end'}>
                            <Flex>
                                <InputSearchSimple
                                    onSearch={(search) => {
                                        tableRef.current?.setFilters({ search });
                                    }}
                                    borderRightRadius={'0'}
                                />
                                <IconButton variant={'outline'} borderLeftRadius={0} aria-label="add" icon={<FiPlus />} onClick={handleCreate} />
                            </Flex>
                        </Stack>
                    </CardHeader>
                    <CardBody>
                        <Stack>
                            <DataTable
                                ref={tableRef}
                                fetchData={({ page, limit, sort, search }) => fetchCurrencies({ page, limit, sort, search, accessToken: profile?.accessToken })}
                                columns={ColumnsTable({
                                    onDelete: handleDelete,
                                    onEdit: handleEdit
                                }) as ColumnDef<CurrencyType>[]}
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