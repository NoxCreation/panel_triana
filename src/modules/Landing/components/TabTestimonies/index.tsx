

import { Button, Flex, Stack, TabPanel, IconButton, useDisclosure, Tooltip, Tag, Switch } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { FormInput } from "../FormControls/FormInput";
import { HeadingTitle } from "../FormControls/HeadingTitle";
import { FormTextarea } from "../FormControls/FormTextarea";
import { ContentType } from "@/types/ContentType";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { CustomColumnDef } from "@/types/CustomColumnDef";
import { CustomDrawer } from "@/components/CustomDrawer";
import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable";
import { CiEdit } from "react-icons/ci";
import { TestimoniesType } from "@/types/TestimoniesType";
import { FormTestimonies } from "../FormTestimonies";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export const TabTestimonies = ({
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
    const [select, setSelect] = useState(undefined as undefined | TestimoniesType)
    console.log("content", content)

    const handleFetch = async () => {
        return {
            data: content.testimonies?.testimonies ? content.testimonies?.testimonies : [],
            meta: {
                "total": 0,
                "page": 1,
                "limit": 10,
                "totalPages": 1
            }
        }
    }

    const handleEditService = (row: TestimoniesType) => {
        setSelect(row)
        onOpen()
    }

    const handleDeleteService = (row: TestimoniesType) => {
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
                const temp = JSON.parse(JSON.stringify(content.testimonies.testimonies)) as Array<any>
                const index = temp.findIndex(e => e.id == id)
                temp.splice(index, 1)
                onChangeContent("testimonies", {
                    testimonies: temp
                })

                Swal.hideLoading()
            }
        })
    }

    const handlePublish = (row: TestimoniesType) => {
        const id = row.id
        const temp = JSON.parse(JSON.stringify(content.testimonies.testimonies)) as Array<any>
        const index = temp.findIndex(e => e.id == id)
        temp[index].publish = !temp[index].publish
        onChangeContent("testimonies", {
            testimonies: temp
        })
    }

    const handleAddTestimonie = (data: TestimoniesType, init: undefined | TestimoniesType) => {
        if (init) {
            const id = init.id
            const temp = JSON.parse(JSON.stringify(content.testimonies.testimonies)) as Array<any>
            const index = temp.findIndex(e => e.id == id)
            temp[index] = data
            onChangeContent("testimonies", {
                testimonies: temp
            })
        }
        else {
            let lastTestimonies = []
            if (content['testimonies']?.testimonies)
                lastTestimonies = [
                    ...content['testimonies']?.testimonies
                ]
            onChangeContent("testimonies", {
                testimonies: [
                    ...lastTestimonies,
                    {
                        ...data
                    }
                ]
            })
        }
        onClose()
    }

    useEffect(() => {
        tableRef.current.refresh()
    }, [content])

    return (
        <TabPanel>

            <CustomDrawer
                title={"Testimonio"}
                isOpen={isOpen}
                onClose={() => { onClose(); }}
                size={'md'}
            >
                {isOpen && <FormTestimonies onAddTestimonie={handleAddTestimonie} init={select} />}
            </CustomDrawer>

            <Stack spacing={4}>
                <HeadingTitle title={"Sección Hero"} />
                <FormInput
                    value={content.testimonies?.main_title}
                    label={"Título principal"}
                    isLoading={isLoading}
                    placeholder="Lo que dicen nuestros clientes"
                    onChange={e => onChangeContent("testimonies", {
                        'main_title': e.target.value
                    })}
                />
                <FormTextarea
                    value={content.testimonies?.main_subtitle}
                    label={"Subtítulo"}
                    isLoading={isLoading}
                    placeholder="Testimonios de clientes que hablan por nuestro trabajo ..."
                    onChange={e => onChangeContent("testimonies", {
                        'main_subtitle': e.target.value
                    })}
                />

                <HeadingTitle title={"Comentarios"}
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
                            onDelete: handleDeleteService,
                            onPublish: handlePublish,
                        }) as ColumnDef<any>[]}
                        defaultPageSize={10}
                        enableExpanding={false}
                        mode="infinite"
                    />
                </Stack>

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
    onDelete,
    onPublish
}: {
    onEdit: (row: TestimoniesType) => void;
    onDelete: (row: TestimoniesType) => void;
    onPublish: (row: TestimoniesType) => void;
}): CustomColumnDef<TestimoniesType>[] => {
    return (
        [
            {
                accessorKey: 'publish',
                header: 'Publicar',
                enableSorting: true,
                cell: ({ getValue, row }) => {

                    return (
                        <>
                            <Switch isChecked={getValue<boolean>()} colorScheme="primary"
                                onChange={e => onPublish(row.original)}
                            />
                        </>
                    )
                }
            },
            {
                accessorKey: 'name',
                header: 'Nombre',
                enableSorting: true,
            },
            {
                accessorKey: 'position',
                header: 'Posición',
                enableSorting: true
            },
            {
                accessorKey: 'comment',
                header: 'Testimonio',
                enableSorting: true
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
