

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
import TextEditor from "@/components/TextEditor";

export const TabMy = ({
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
                    value={content.my?.label}
                    label={"Etiqueta"}
                    isLoading={isLoading}
                    placeholder="CEO & Estrat ..."
                    onChange={e => onChangeContent("my", {
                        'label': e.target.value
                    })}
                />
                <FormInput
                    value={content.my?.fullname}
                    label={"Nombre Completo"}
                    isLoading={isLoading}
                    placeholder="Leyanis Triana ..."
                    onChange={e => onChangeContent("my", {
                        'fullname': e.target.value
                    })}
                />
                <FormTextarea
                    value={content.my?.mini_description}
                    label={"Descripción Breve"}
                    isLoading={isLoading}
                    placeholder="Descripción breve acá sobre ti"
                    onChange={e => onChangeContent("my", {
                        'mini_description': e.target.value
                    })}
                />
                <Flex gap={2}>
                    <FormInput
                        value={content.my?.contact?.linkedln}
                        label={"Link a Linkedln"}
                        isLoading={isLoading}
                        placeholder="Link a linkedln"
                        onChange={e => onChangeContent("my", {
                            'contact': {
                                ...content.my?.contact,
                                linkedln: e.target.value
                            }
                        })}
                    />

                    <FormInput
                        value={content.my?.contact?.tittok}
                        label={"Link a Tittok"}
                        isLoading={isLoading}
                        placeholder="Link a tittok"
                        onChange={e => onChangeContent("my", {
                            'contact': {
                                ...content.my?.contact,
                                tittok: e.target.value
                            }
                        })}
                    />

                    <FormInput
                        value={content.my?.contact?.email}
                        label={"Cuenta de correo"}
                        isLoading={isLoading}
                        placeholder="servicios@3ana.com"
                        onChange={e => onChangeContent("my", {
                            'contact': {
                                ...content.my?.contact,
                                email: e.target.value
                            }
                        })}
                    />
                </Flex>

                <HeadingTitle title={"Cita personal"} />

                <FormTextarea
                    value={content.my?.quote}
                    label={"Cita breve"}
                    isLoading={isLoading}
                    placeholder="Todo comenz..."
                    rows={4}
                    onChange={e => onChangeContent("my", {
                        'quote': e.target.value
                    })}
                />

                <HeadingTitle title={"Descripción más amplia"} />

                <TextEditor
                    body={content.my?.full_description}
                    loading={false}
                    setBody={(html) => {
                        onChangeContent("my", {
                            'full_description': html
                        })
                    }}
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
