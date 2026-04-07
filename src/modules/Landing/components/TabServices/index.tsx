

import { Button, Flex, Stack, TabPanel, IconButton, useDisclosure, Tooltip, Tag } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { FormInput } from "../FormControls/FormInput";
import { HeadingTitle } from "../FormControls/HeadingTitle";
import { FormTextarea } from "../FormControls/FormTextarea";
import { ContentType } from "@/types/ContentType";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { CustomColumnDef } from "@/types/CustomColumnDef";
import { CustomDrawer } from "@/components/CustomDrawer";
import { FormService } from "../FormService";
import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable";
import { CiEdit } from "react-icons/ci";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { ServiceType } from "@/types/ServiceType";

export const TabServices = ({
    content,
    isLoading,
    onChangeContent,
    onSaveContent
}: {
    content: ContentType
    isLoading: boolean
    onChangeContent: (key: string, new_content: { [key: string]: any }) => void
    onSaveContent: () => void
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const tableRef = useRef<DataTableRef<any>>(null);
    const [select, setSelect] = useState(undefined as undefined | ServiceType)
    console.log("content", content)

    const handleFetch = async () => {
        return {
            data: content.services.services,
            meta: {
                "total": 0,
                "page": 1,
                "limit": 10,
                "totalPages": 1
            }
        }
    }

    const handleAddService = (data: any, init: undefined | ServiceType) => {
        if (init) {
            const id = init.id
            const temp = JSON.parse(JSON.stringify(content.services.services)) as Array<any>
            const index = temp.findIndex(e => e.id == id)
            temp[index] = data
            onChangeContent("services", {
                services: temp
            })
        }
        else {
            let lastServices = []
            if (content['services']?.services)
                lastServices = [
                    ...content['services']?.services
                ]
            onChangeContent("services", {
                services: [
                    ...lastServices,
                    {
                        ...data
                    }
                ]
            })
        }
        onClose()
    }

    const handleEditService = (row: ServiceType) => {
        setSelect(row)
        onOpen()
    }

    const handleDeleteService = (row: ServiceType) => {
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

                const id = row.id
                const temp = JSON.parse(JSON.stringify(content.services.services)) as Array<any>
                const index = temp.findIndex(e => e.id == id)
                temp.splice(index, 1)
                onChangeContent("services", {
                    services: temp
                })

                Swal.hideLoading()
            }
        })
    }

    useEffect(() => {
        tableRef.current.refresh()
    }, [content])

    return (
        <TabPanel>

            <CustomDrawer
                title={"Servicio"}
                isOpen={isOpen}
                onClose={() => { onClose(); }}
                minW="calc(100% - (16px*2))"
            >
                {isOpen && <FormService onAddService={handleAddService} init={select} />}
            </CustomDrawer>

            <Stack spacing={4}>
                <HeadingTitle title={"Sección Hero"} />
                <FormInput
                    value={content['services']?.main_title}
                    label={"Título principal"}
                    isLoading={isLoading}
                    placeholder="Servicios de Marketing y Consultoría"
                    onChange={e => onChangeContent("services", {
                        'main_title': e.target.value
                    })}
                />
                <FormTextarea
                    value={content['services']?.main_subtitle}
                    label={"Subtítulo"}
                    isLoading={isLoading}
                    placeholder="Nos hacemos cargo desde que ..."
                    onChange={e => onChangeContent("services", {
                        'main_subtitle': e.target.value
                    })}
                />

                <HeadingTitle title={"Listado de Servicios"}
                    onClick={() => {
                        setSelect(undefined)
                        onOpen()
                    }}
                />

                <Stack>
                    <DataTable
                        ref={tableRef}
                        fetchData={({ page, limit, sort, search }) => handleFetch()}
                        columns={ColumnsTable({
                            onEdit: handleEditService,
                            onDelete: handleDeleteService
                        }) as ColumnDef<any>[]}
                        defaultPageSize={10}
                        enableExpanding={false}
                        mode="infinite"
                    />
                </Stack>

                <HeadingTitle title={"Aclaración"} />

                <FormTextarea
                    value={content['services']?.important_clarification}
                    label={"Texto Aclaratorio"}
                    isLoading={isLoading}
                    placeholder="Aclaraciones importantes ..."
                    onChange={e => onChangeContent("services", {
                        'important_clarification': e.target.value
                    })}
                />

                <Button isDisabled={isLoading} onClick={async () => {
                    await onSaveContent()
                }}>
                    Guardar cambios
                </Button>
            </Stack>
        </TabPanel>
    )
}

const ColumnsTable = ({
    onEdit,
    onDelete
}: {
    onEdit: (row: ServiceType) => void;
    onDelete: (row: ServiceType) => void;
}): CustomColumnDef<ServiceType>[] => {
    return (
        [
            {
                accessorKey: 'title',
                header: 'title',
                enableSorting: true,
            },
            {
                accessorKey: 'type',
                header: 'type',
                enableSorting: true
            },
            {
                accessorKey: 'price',
                header: 'price',
                enableSorting: true
            },
            {
                accessorKey: 'tiquet',
                header: 'tiquet',
                enableSorting: true,
                cell: ({ getValue }) => {
                    const tickets = getValue<Array<{ label: string; variant: "primary" | "outline" }>>()

                    return (
                        <Stack>
                            {tickets.map((ticket, index) => (
                                <Tag variant={'outline'} key={index}>{ticket.label}</Tag>
                            ))}
                        </Stack>
                    )
                }
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <Flex gap={2} justifyContent={'end'}>
                        <Tooltip label="Editar">
                            <IconButton
                                colorScheme="primary.500"
                                variant={'ghost'} size={'sm'} aria-label='Edit' icon={<CiEdit />} onClick={() => onEdit(row.original)} />
                        </Tooltip>
                        <IconButtonDeleteTable
                            onDelete={onDelete}
                            row={row.original}
                        />
                    </Flex>
                ),
            }
        ]
    )
}