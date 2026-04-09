

import { Button, Flex, Stack, TabPanel, Text, IconButton, useDisclosure, SimpleGrid } from "@chakra-ui/react"
import IconPickerModal from "../IconPickerModal"
import * as FeatherIcons from "react-icons/fi";
import { useState } from "react";
import { FormInput } from "../FormControls/FormInput";
import { HeadingTitle } from "../FormControls/HeadingTitle";
import { FormTextarea } from "../FormControls/FormTextarea";
import { ContentType } from "@/types/ContentType";
import { ButtonIconEdit } from "../ButtonIconEdit";

export const TabHome = ({
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
    const [why_choose_me_index, set_why_choose_me_index] = useState(0)
    const [section, set_section] = useState(0)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleSelectIcon = (iconName: string) => {
        let temp = []
        if (section == 0) {
            temp = content['home']?.why_choose_me
            temp[why_choose_me_index].icon = iconName
            onChangeContent("home", {
                'why_choose_me': temp
            })
        }
        else if (section == 2) {
            temp = content['home']?.how_we_work
            temp[why_choose_me_index].icon = iconName
            onChangeContent("home", {
                'how_we_work': temp
            })
        }
    }

    const handleOpen = (index: number, section: number) => {
        set_why_choose_me_index(index)
        set_section(section)
        onOpen()
    }

    const handleDeleteWhyChooseMe = (index: number, section: number) => {
        if (section == 0) {
            let temp = content['home']?.why_choose_me || []
            temp.splice(index, 1)
            onChangeContent("home", {
                'why_choose_me': temp
            })
        }
        else if (section == 2) {
            let temp = content['home']?.how_we_work || []
            temp.splice(index, 1)
            onChangeContent("home", {
                'how_we_work': temp
            })
        }
    }

    return (
        <TabPanel>
            <IconPickerModal
                isOpen={isOpen}
                onClose={onClose}
                onSelectIcon={handleSelectIcon}
            />

            <Stack spacing={4}>
                <HeadingTitle title={"Sección Hero"} />
                <FormInput
                    value={content['home']?.main_title}
                    label={"Título principal"}
                    isLoading={isLoading}
                    placeholder="Marketing & Consultoría que mueve negocios"
                    onChange={e => onChangeContent("home", {
                        'main_title': e.target.value
                    })}
                />
                <FormTextarea
                    value={content['home']?.main_subtitle}
                    label={"Subtítulo"}
                    isLoading={isLoading}
                    placeholder="Marketing & Consultoria ..."
                    onChange={e => onChangeContent("home", {
                        'main_subtitle': e.target.value
                    })}
                />
                <FormTextarea
                    value={content['home']?.main_label}
                    label={"Texto descriptivo"}
                    isLoading={isLoading}
                    placeholder="Ayudo a emprendedores y restaurantes..."
                    onChange={e => onChangeContent("home", {
                        'main_label': e.target.value
                    })}
                />
                <Flex gap={4}>
                    <FormInput
                        value={content['home']?.btn_cta_to_schedule}
                        label={"CTA Izquierdo"}
                        isLoading={isLoading}
                        onChange={e => onChangeContent("home", {
                            'btn_cta_to_schedule': e.target.value
                        })}
                    />
                    <FormInput
                        value={content['home']?.btn_cta_my_work}
                        label={"CTA Derecho"}
                        isLoading={isLoading}
                        onChange={e => onChangeContent("home", {
                            'btn_cta_my_work': e.target.value
                        })}
                    />
                </Flex>
                <Flex gap={4}>
                    <FormInput
                        value={content['home']?.stats?.driven_businesses.toString()}
                        label={"Negocios Impulsados"}
                        isLoading={isLoading}
                        onChange={e => onChangeContent("home", {
                            'stats': {
                                ...content['home']?.stats,
                                'driven_businesses': e.target.value
                            }
                        })}
                    />
                    <FormInput
                        value={content['home']?.stats?.years_of_experience.toString()}
                        label={"Años de Experiencia"}
                        isLoading={isLoading}
                        onChange={e => onChangeContent("home", {
                            'stats': {
                                ...content['home']?.stats,
                                'years_of_experience': e.target.value
                            }
                        })}
                    />
                    <FormInput
                        value={content['home']?.stats?.satisfied_customers.toString()}
                        label={"Clientes Satisfechos"}
                        isLoading={isLoading}
                        onChange={e => onChangeContent("home", {
                            'stats': {
                                ...content['home']?.stats,
                                'satisfied_customers': e.target.value
                            }
                        })}
                    />
                </Flex>

                <HeadingTitle title={"¿Por qué elegirnos?"}
                    onClick={() => {
                        let temp = content['home']?.why_choose_me || []
                        temp.push({
                            icon: "",
                            title: "",
                            description: ""
                        })
                        onChangeContent("home", {
                            'why_choose_me': temp
                        })
                    }}
                />

                <Flex gap={4}>
                    <SimpleGrid columns={4} gap={4}>
                        {content['home']?.why_choose_me && content['home']?.why_choose_me.map((item, index) => (
                            <Stack flex={1} key={index}>
                                <ButtonIconEdit
                                    icon={item.icon}
                                    onOpen={() => handleOpen(index, 0)}
                                    onDeleteWhyChooseMe={() => handleDeleteWhyChooseMe(index, 0)}
                                />
                                <FormInput
                                    value={content['home']?.why_choose_me[index]?.title}
                                    label={"Título"}
                                    isLoading={isLoading}
                                    onChange={e => {
                                        let temp = content['home']?.why_choose_me || []
                                        temp[index].title = e.target.value
                                        onChangeContent("home", {
                                            'why_choose_me': temp
                                        })
                                    }}
                                />
                                <FormTextarea
                                    value={content['home']?.why_choose_me[index]?.description}
                                    label={"Descripcion"}
                                    isLoading={isLoading}
                                    rows={6}
                                    onChange={e => {
                                        let temp = content['home']?.why_choose_me || []
                                        temp[index].description = e.target.value
                                        onChangeContent("home", {
                                            'why_choose_me': temp
                                        })
                                    }}
                                />
                            </Stack>
                        ))}
                    </SimpleGrid>

                    {(content['home']?.why_choose_me == undefined || content['home']?.why_choose_me.length == 0) && (
                        <Text w={'100%'} fontSize={'12px'} textAlign={'center'} fontWeight={500} color={'gray.400'}>
                            No hay elementos que listar
                        </Text>
                    )}
                </Flex>

                <HeadingTitle title={"Sección resaltada"}
                    onClick={() => {
                        let temp = content['home']?.strategic_section || {
                            title: "",
                            description: "",
                            items: []
                        }
                        temp.items.push({
                            title: ""
                        })
                        console.log("temp", temp)
                        onChangeContent("home", {
                            'strategic_section': temp
                        })
                    }}
                />

                <Stack gap={4}>
                    <FormInput
                        value={content['home']?.strategic_section?.title}
                        label={"Título"}
                        isLoading={isLoading}
                        placeholder="Estrategias que conectan con tus clientes"
                        onChange={e => onChangeContent("home", {
                            'strategic_section': {
                                ...content['home']?.strategic_section,
                                title: e.target.value,
                                items: content['home']?.strategic_section?.items || []
                            }
                        })}
                    />
                    <FormTextarea
                        value={content['home']?.strategic_section?.description}
                        label={"Subtítulo"}
                        isLoading={isLoading}
                        placeholder="En 3ana Marketing & Consulting no solo creamos ca..."
                        cols={6}
                        onChange={e => onChangeContent("home", {
                            'strategic_section': {
                                ...content['home']?.strategic_section,
                                description: e.target.value,
                                items: content['home']?.strategic_section?.items || []
                            }
                        })}
                    />
                    <Flex gap={4} flexDir={'column'}>
                        {content['home']?.strategic_section?.items && content['home']?.strategic_section?.items.map((item, index) => (
                            <Stack flex={1} key={index} >
                                <Flex gap={2} alignItems={'center'} justifyContent={'center'}>
                                    <FormInput
                                        value={content['home']?.strategic_section.items[index].title}
                                        label={`Punto ${index + 1}`}
                                        isLoading={isLoading}
                                        onChange={e => {
                                            let temp = content['home']?.strategic_section || {
                                                title: "",
                                                description: "",
                                                items: []
                                            }
                                            temp.items[index].title = e.target.value
                                            onChangeContent("home", {
                                                'strategic_section': temp
                                            })
                                        }}
                                    />
                                    <IconButton
                                        size={'xs'} colorScheme="red" variant={'ghost'}
                                        aria-label="replace" icon={<FeatherIcons.FiTrash2 />} onClick={() => handleDeleteWhyChooseMe(index, 0)} />
                                </Flex>
                            </Stack>
                        ))}

                        {(content['home']?.strategic_section == undefined || content['home']?.strategic_section?.items.length == 0) && (
                            <Text w={'100%'} fontSize={'12px'} textAlign={'center'} fontWeight={500} color={'gray.400'}>
                                No hay elementos que listar
                            </Text>
                        )}
                    </Flex>
                </Stack>

                <HeadingTitle title={"¿Cómo trabajamos juntos?"}
                    onClick={() => {
                        let temp = content['home']?.how_we_work || []
                        temp.push({
                            icon: "",
                            title: "",
                            description: ""
                        })
                        onChangeContent("home", {
                            'how_we_work': temp
                        })
                    }}
                />
                <Flex gap={4}>
                    <SimpleGrid columns={4} gap={4}>
                        {content['home']?.how_we_work && content['home']?.how_we_work.map((item, index) => (
                            <Stack flex={1} key={index}>
                                <ButtonIconEdit
                                    icon={item.icon}
                                    onOpen={() => handleOpen(index, 2)}
                                    onDeleteWhyChooseMe={() => handleDeleteWhyChooseMe(index, 2)}
                                />
                                <FormInput
                                    value={content['home']?.how_we_work[index]?.title}
                                    label={"Título"}
                                    isLoading={isLoading}
                                    onChange={e => {
                                        let temp = content['home']?.how_we_work || []
                                        temp[index].title = e.target.value
                                        onChangeContent("home", {
                                            'how_we_work': temp
                                        })
                                    }}
                                />
                                <FormTextarea
                                    value={content['home']?.how_we_work[index]?.description}
                                    label={"Descripcion"}
                                    isLoading={isLoading}
                                    rows={6}
                                    onChange={e => {
                                        let temp = content['home']?.how_we_work || []
                                        temp[index].description = e.target.value
                                        onChangeContent("home", {
                                            'how_we_work': temp
                                        })
                                    }}
                                />
                            </Stack>
                        ))}
                    </SimpleGrid>

                    {(content['home']?.how_we_work == undefined || content['home']?.how_we_work.length == 0) && (
                        <Text w={'100%'} fontSize={'12px'} textAlign={'center'} fontWeight={500} color={'gray.400'}>
                            No hay elementos que listar
                        </Text>
                    )}
                </Flex>

                <Button isDisabled={isLoading} onClick={async () => {
                    await onSaveContent()
                }}>
                    Guardar cambios
                </Button>
            </Stack>
        </TabPanel>
    )
}