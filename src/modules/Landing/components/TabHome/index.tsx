import { Button, FormControl, FormLabel, Input, Stack, TabPanel, Textarea } from "@chakra-ui/react"

export const TabHome = ({
    content,
    isLoading,
    onChangeContent,
    onSaveContent
}: {
    content: any
    isLoading: boolean
    onChangeContent: (key: string, new_content: { [key: string]: any }) => void
    onSaveContent: () => void
}) => {
    return (
        <TabPanel>
            <Stack spacing={4}>
                <FormControl>
                    <FormLabel>Título principal</FormLabel>
                    <Input placeholder="Marketing & Consultoría que mueve negocios"
                        isDisabled={isLoading}
                        value={content['home']?.main_title}
                        onChange={e => onChangeContent("home", {
                            'main_title': e.target.value
                        })}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Subtítulo</FormLabel>
                    <Textarea rows={2} placeholder="Ayudo a emprendedores y restaurantes..."
                        isDisabled={isLoading}
                        value={content['home']?.main_subtitle}
                        onChange={e => onChangeContent("home", {
                            'main_subtitle': e.target.value
                        })}
                    />
                </FormControl>
                <Button isDisabled={isLoading} onClick={async () => {
                    await onSaveContent()
                }}>
                    Guardar cambios
                </Button>
            </Stack>
        </TabPanel>
    )
}