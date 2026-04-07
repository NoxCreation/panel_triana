import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    InputGroup,
    InputLeftElement,
    Grid,
    GridItem,
    Icon,
    Button,
    Text,
    InputRightElement,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { FiSearch } from "react-icons/fi";
import * as FeatherIcons from "react-icons/fi";

// Obtener todos los nombres de íconos de Feather (excluyendo el export default)
const featherIconNames = Object.keys(FeatherIcons).filter(
    (key) => key !== "default" && key.startsWith("Fi")
);

interface IconPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectIcon: (iconName: string) => void;
}

export default function IconPickerModal({
    isOpen,
    onClose,
    onSelectIcon,
}: IconPickerModalProps) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar íconos según búsqueda
    const filteredIcons = useMemo(() => {
        if (!searchTerm) return featherIconNames;
        return featherIconNames.filter((name) =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleIconClick = (iconName: string) => {
        onSelectIcon(iconName);
        onClose();
        setSearchTerm(""); // limpiar búsqueda al cerrar
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Selecciona un ícono</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <InputGroup mb={4}>
                        <InputRightElement pointerEvents="none">
                            <Icon as={FiSearch} color="gray.400" />
                        </InputRightElement>
                        <Input
                            placeholder="Buscar ícono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </InputGroup>
                    <Grid
                        templateColumns="repeat(auto-fill, minmax(70px, 1fr))"
                        gap={3}
                        maxH="400px"
                        overflowY="auto"
                        p={1}
                    >
                        {filteredIcons.map((iconName) => {
                            const IconComponent = FeatherIcons[iconName as keyof typeof FeatherIcons];
                            return (
                                <GridItem key={iconName}>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleIconClick(iconName)}
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        py={4}
                                        px={2}
                                        h="auto"
                                        w="100%"
                                        _hover={{ bg: "primary.50", borderColor: "primary.500" }}
                                    >
                                        <Icon as={IconComponent} boxSize={6} mb={1} />
                                        <Text fontSize="9px" noOfLines={1}>
                                            {iconName}
                                        </Text>
                                    </Button>
                                </GridItem>
                            );
                        })}
                    </Grid>
                    {filteredIcons.length === 0 && (
                        <Text textAlign="center" color="gray.500" mt={4}>
                            No se encontraron íconos
                        </Text>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}