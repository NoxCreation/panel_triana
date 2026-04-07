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
import { UserType } from "@/types/UserType";
import { InputSearchSimple } from "@/components/InputSearchSimple";
import { FiPlus } from "react-icons/fi";
import { CustomDrawer } from "@/components/CustomDrawer";
import { CrudDrawer } from "@/components/SimpleCrud/Form/CrudDrawer";
import { FormUser } from "./FormUser";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useFetch } from "@/hooks/useFetch";
import { ArticleType } from "@/types/ArticleType";
import { useRouter } from "next/router";

export default function BlogIndex() {
    const profile = useGetProfile();
    const router = useRouter()
    const tableRef = useRef<DataTableRef<UserType>>(null);
    const [fieldEdit, setFieldEdit] = useState(undefined)
    const { handleFetch } = useFetch()

    // Función fetchData que llama a la API
    const fetchArticles = async ({ page, limit, sort, search, accessToken }) => {
        if (accessToken) {
            const params = new URLSearchParams();
            params.append('page', String(page)); // si tu API usa page base 1
            params.append('limit', String(limit));
            if (search) params.append('search', String(search));
            if (sort) params.append('sort', sort);
            const res = await fetch(`/api/v1/blog?${params}`, {
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
    const handleDelete = (user: ArticleType) => {
       
    }

    const handleEdit = (article: ArticleType) => {
        router.push(`/blog/edit/${article.id}`)
    }

    const handleCreate = () => {
        router.push(`/blog/create`)
    }

    return (
        <ContainerSystem navBarControl={
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink href='#'>Blog</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='/blog'>Listar</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        }>

            <Stack spacing={2}>

                <Card variant={'table'}>
                    <CardHeader display={"flex"} alignItems={{ base: "inherit", md: "center" }} flexDir={{ base: "column", md: 'row' }}>
                        <Heading size='md' flex={1}>Artículos</Heading>
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
                                fetchData={({ page, limit, sort, search }) => fetchArticles({ page, limit, sort, search, accessToken: profile?.accessToken })}
                                columns={ColumnsTable({
                                    onDelete: handleDelete,
                                    onEdit: handleEdit
                                }) as ColumnDef<ArticleType>[]}
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
