

import { Button, Flex, Stack, TabPanel, IconButton, Tooltip, Switch } from "@chakra-ui/react"
import { FormInput } from "../FormControls/FormInput";
import { HeadingTitle } from "../FormControls/HeadingTitle";
import { FormTextarea } from "../FormControls/FormTextarea";
import { ContentType } from "@/types/ContentType";
import { CustomColumnDef } from "@/types/CustomColumnDef";
import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable";
import { CiEdit } from "react-icons/ci";
import { TestimoniesType } from "@/types/TestimoniesType";

export const TabContact = ({
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
    console.log("content", content)

    return (
        <TabPanel>
            <Stack spacing={4}>
                <HeadingTitle title={"Sección Hero"} />
                <FormInput
                    value={content?.contact?.main_title}
                    label={"Título principal"}
                    isLoading={isLoading}
                    placeholder="Contáctanos"
                    onChange={e => onChangeContent("contact", {
                        'main_title': e.target.value
                    })}
                />
                <FormTextarea
                    value={content?.contact?.main_subtitle}
                    label={"Subtítulo"}
                    isLoading={isLoading}
                    placeholder="¿Tienes un proeycto en mente? ..."
                    onChange={e => onChangeContent("contact", {
                        'main_subtitle': e.target.value
                    })}
                />

                <HeadingTitle title={"Información de contacto"} />

                <FormInput
                    value={content?.contact?.contact?.address}
                    label={"Dirección"}
                    isLoading={isLoading}
                    placeholder="Calle Ejemplo 123, Ciudad, País"
                    onChange={e => onChangeContent("contact", {
                        'contact': {
                            ...content.contact.contact,
                            address: e.target.value
                        }
                    })}
                />

                <FormInput
                    value={content?.contact?.contact?.phone}
                    label={"Teléfono"}
                    isLoading={isLoading}
                    placeholder="+1 123 456 789"
                    onChange={e => onChangeContent("contact", {
                        'contact': {
                            ...content.contact.contact,
                            phone: e.target.value
                        }
                    })}
                />

                <FormInput
                    value={content?.contact?.contact?.email}
                    label={"Correo"}
                    isLoading={isLoading}
                    placeholder="servicios@3anamarketing.com"
                    onChange={e => onChangeContent("contact", {
                        'contact': {
                            ...content.contact.contact,
                            email: e.target.value
                        }
                    })}
                />

                <FormInput
                    value={content?.contact?.contact?.hours}
                    label={"Horario de atención"}
                    isLoading={isLoading}
                    placeholder="Lun - Vie: 9:00 - 18:00"
                    onChange={e => onChangeContent("contact", {
                        'contact': {
                            ...content.contact.contact,
                            hours: e.target.value
                        }
                    })}
                />

                <HeadingTitle title={"Redes Sociales"} />

                <FormInput
                    value={content?.contact?.social?.linkedln}
                    label={"Link a Linkedln"}
                    isLoading={isLoading}
                    placeholder=""
                    onChange={e => onChangeContent("contact", {
                        'social': {
                            ...content.contact.social,
                            linkedln: e.target.value
                        }
                    })}
                />

                <FormInput
                    value={content?.contact?.social?.tiktok}
                    label={"Link a TikTok"}
                    isLoading={isLoading}
                    placeholder=""
                    onChange={e => onChangeContent("contact", {
                        'social': {
                            ...content.contact.social,
                            tiktok: e.target.value
                        }
                    })}
                />

                <FormInput
                    value={content?.contact?.social?.facebook}
                    label={"Link a Facebook"}
                    isLoading={isLoading}
                    placeholder=""
                    onChange={e => onChangeContent("contact", {
                        'social': {
                            ...content.contact.social,
                            facebook: e.target.value
                        }
                    })}
                />

                <FormInput
                    value={content?.contact?.social?.instagram}
                    label={"Link a Instagram"}
                    isLoading={isLoading}
                    placeholder=""
                    onChange={e => onChangeContent("contact", {
                        'social': {
                            ...content.contact.social,
                            instagram: e.target.value
                        }
                    })}
                />

                <FormInput
                    value={content?.contact?.social?.youtube}
                    label={"Link a Youtube"}
                    isLoading={isLoading}
                    placeholder=""
                    onChange={e => onChangeContent("contact", {
                        'social': {
                            ...content.contact.social,
                            youtube: e.target.value
                        }
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
