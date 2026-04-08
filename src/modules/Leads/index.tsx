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
    useToast,
} from "@chakra-ui/react";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { useRef, useState } from "react";
import { ColumnsTable } from "./TableColumns";
import { ColumnDef } from "@tanstack/react-table";
import { UserType } from "@/types/UserType";
import { InputSearchSimple } from "@/components/InputSearchSimple";
import { FiPlus } from "react-icons/fi";
import { CustomDrawer } from "@/components/CustomDrawer";
import { CrudDrawer } from "@/components/SimpleCrud/Form/CrudDrawer";
import { FormLead } from "./FormLead";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useFetch } from "@/hooks/useFetch";

export default function LeadsIndex() {
    const profile = useGetProfile();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const tableRef = useRef<DataTableRef<UserType>>(null);
    const [fieldEdit, setFieldEdit] = useState(undefined)
    const { handleFetch } = useFetch()

    // Función fetchData que llama a la API
    const fetchLeads = async ({ page, limit, sort, search, accessToken }) => {
        if (accessToken) {
            const params = new URLSearchParams();
            params.append('page', String(page)); // si tu API usa page base 1
            params.append('limit', String(limit));
            if (search) params.append('search', String(search));
            if (sort) params.append('sort', sort);
            const res = await fetch(`/api/v1/leads?${params}`, {
                headers: {
                    'authorization': `Bearer ${accessToken}`
                }
            });
            if (res.status == 200) {
                const json = await res.json();
                console.log(json)
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

    // Funcion para eliminar
    const handleDelete = (user: UserType) => {
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
                    `/leads/${user.id}`,
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

    return (
        <ContainerSystem navBarControl={
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Leads</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='/leads'>Listar</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        }>
            <CustomDrawer
                title={fieldEdit ? "Editar Lead" : "Crear Lead"}
                isOpen={isOpen}
                onClose={() => { onClose(); }}
                size="sm"
            >
                <CrudDrawer
                    fields={[
                        { name: "photo", label: 'Foto', default: "", type: "string" },
                        { name: "email", label: 'Correo', default: "", type: "string" },
                        { name: "first_name", label: 'Nombres', default: "", type: "string" },
                        { name: "last_name", label: 'Apellidos', default: "", type: "string" },
                        { name: "role", label: 'Role', default: "", type: "string" },
                        { name: "password", label: 'Contraseña', default: "", type: "string" }
                    ]}
                    initialice={fieldEdit}
                    endpoint={"/users"}
                    onClose={() => { onClose(); tableRef.current.refresh(); }}
                    FieldComponent={FormLead}
                />
            </CustomDrawer>

            <Stack spacing={2}>

                <Card variant={'table'}>
                    <CardHeader display={"flex"} alignItems={{ base: "inherit", md: "center" }} flexDir={{ base: "column", md: 'row' }}>
                        <Heading size='md' flex={1}>Leads</Heading>
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
                                fetchData={({ page, limit, sort, search }) => fetchLeads({ page, limit, sort, search, accessToken: profile?.accessToken })}
                                columns={ColumnsTable({
                                    onDelete: handleDelete
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
