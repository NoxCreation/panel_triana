"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import {
    Box,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    useDisclosure,
    Flex,
    Icon,
    Text,
    Stack
} from "@chakra-ui/react"
import ReactCrop, { type Crop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { FiTrash2, FiUpload } from "react-icons/fi"

interface ImageUploadProps {
    onChangeImage: (image: string | undefined) => void
    isDisabled?: boolean
    image?: string | undefined // Puede ser base64 o URL
    width?: number // Ancho deseado para la imagen final (opcional)
    height?: number // Alto deseado para la imagen final (opcional)
    w?: number
    h?: number
    aspectRatio?: number // Proporción ancho/alto para el recorte (opcional)
}

export const ImageUploadEdit = ({
    onChangeImage,
    isDisabled = false,
    image = undefined,
    width = 300, // Valor por defecto
    height = 300, // Valor por defecto
    w = 120,
    h = 120,
    aspectRatio = width / height // Calculado si no se proporciona
}: ImageUploadProps) => {
    const [currentImage, setCurrentImage] = useState<string | undefined>(image)
    const [tempImage, setTempImage] = useState<string | undefined>(undefined)
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        width: 90,
        height: 90,
        x: 5,
        y: 5,
    })

    const { isOpen, onOpen, onClose } = useDisclosure()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    // Actualizar la imagen actual si cambia el prop image
    useEffect(() => {
        setCurrentImage(image ? (image.includes("null") ? undefined : image) : undefined)
    }, [image])

    const handleClick = () => {
        if (!currentImage) {
            fileInputRef.current?.click()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader()
            reader.onload = () => {
                setTempImage(reader.result as string)
                onOpen()
            }
            reader.readAsDataURL(e.target.files[0])
            e.target.value = ""
        }
    }

    // Esta función crea un recorte con la proporción deseada centrado
    const createCenteredCrop = useCallback((imgWidth: number, imgHeight: number) => {
        let cropWidth, cropHeight, x, y

        // Calcular el recorte manteniendo la proporción deseada
        if (imgWidth / imgHeight > aspectRatio) {
            // La imagen es más ancha que la proporción deseada
            cropHeight = imgHeight
            cropWidth = cropHeight * aspectRatio
            x = (imgWidth - cropWidth) / 2
            y = 0
        } else {
            // La imagen es más alta que la proporción deseada
            cropWidth = imgWidth
            cropHeight = cropWidth / aspectRatio
            x = 0
            y = (imgHeight - cropHeight) / 2
        }

        return {
            unit: "px",
            width: cropWidth,
            height: cropHeight,
            x: x,
            y: y,
        }
    }, [aspectRatio])

    // Esta función convierte un recorte de píxeles a porcentaje
    const pxToPercentCrop = useCallback((pixelCrop: Crop, width: number, height: number) => {
        return {
            unit: "%",
            width: (pixelCrop.width / width) * 100,
            height: (pixelCrop.height / height) * 100,
            x: (pixelCrop.x / width) * 100,
            y: (pixelCrop.y / height) * 100,
        }
    }, [])

    const handleCropComplete = useCallback(() => {
        if (!imgRef.current) return

        const image = imgRef.current
        const canvas = document.createElement("canvas")

        // Convertimos el recorte a píxeles si está en porcentaje
        let pixelCrop: { x: number; y: number; width: number; height: number }

        if (crop.unit === "%") {
            pixelCrop = {
                x: (crop.x * image.width) / 100,
                y: (crop.y * image.height) / 100,
                width: (crop.width * image.width) / 100,
                height: (crop.height * image.height) / 100,
            }
        } else {
            pixelCrop = crop as { x: number; y: number; width: number; height: number }
        }

        // Calculamos la escala para convertir de dimensiones de visualización a dimensiones naturales
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        // Establecemos las dimensiones del canvas con las medidas deseadas
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Dibujamos la porción recortada en el canvas, redimensionando a las dimensiones deseadas
        ctx.drawImage(
            image,
            pixelCrop.x * scaleX,
            pixelCrop.y * scaleY,
            pixelCrop.width * scaleX,
            pixelCrop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height,
        )

        // Convertimos el canvas a base64
        const base64Image = canvas.toDataURL("image/jpeg", 0.95)
        setCurrentImage(base64Image)
        onChangeImage(base64Image)
        onClose()
    }, [crop, onChangeImage, onClose, width, height])

    const handleDelete = () => {
        setCurrentImage(undefined)
        onChangeImage(undefined)
    }

    const handleImageLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const img = e.currentTarget as any
            (imgRef as any).current = img

            // Creamos un recorte con la proporción deseada centrado en píxeles
            const pixelCrop = createCenteredCrop(img.width, img.height)

            // Convertimos a porcentaje para la visualización
            const percentCrop = pxToPercentCrop(pixelCrop as any, img.width, img.height)

            // Actualizamos el estado del recorte
            setCrop(percentCrop as any)
        },
        [createCenteredCrop, pxToPercentCrop],
    )

    return (
        <Box>
            <Box
                width={`${w}px`}
                height={`${h}px`}
                border="1px dashed"
                borderColor="gray.300"
                borderRadius="md"
                display="flex"
                alignItems="center"
                bg={currentImage ? "transparent" : "gray.50"}
                justifyContent="center"
                position="relative"
                overflow="hidden"
                cursor={!currentImage ? "pointer" : "default"}
                onClick={isDisabled ? () => { } : handleClick}
                _hover={{
                    borderColor: currentImage ? "gray.300" : "primary.500",
                    bg: currentImage ? "transparent" : "gray.100"
                }}
            >
                {(currentImage == undefined) ? (
                    <Stack alignItems={'center'}>
                        <Icon as={FiUpload} boxSize={8} mb={2} color="gray.500" />
                        <Text textAlign="center" color="gray.600" px={4} fontSize={"sm"}>
                            Haz clic para seleccionar tu imagen
                        </Text>
                    </Stack>
                ) : (
                    <>
                        <Box as="img" src={currentImage} alt="Uploaded image" width="100%" height="100%" objectFit="cover" />
                        <IconButton
                            aria-label="Delete image"
                            icon={<FiTrash2 size={16} />}
                            size="sm"
                            colorScheme="red"
                            position="absolute"
                            bottom="2"
                            right="2"
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDelete()
                            }}
                            isDisabled={isDisabled}
                        />
                    </>
                )}
            </Box>

            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*" onChange={handleFileChange} />

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Recortar Imagen</ModalHeader>
                    <ModalBody>
                        {tempImage && (
                            <Flex justifyContent="center">
                                <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={aspectRatio} circularCrop={false}>
                                    <img
                                        src={tempImage || "/placeholder.svg"}
                                        alt="Crop preview"
                                        onLoad={handleImageLoad}
                                        style={{ maxHeight: "60vh", maxWidth: "100%" }}
                                    />
                                </ReactCrop>
                            </Flex>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button width={"120px"} variant="ghost" size={"sm"} mr={3} colorScheme="red" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button width={"120px"} size={"sm"} onClick={handleCropComplete}>
                            Recortar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}