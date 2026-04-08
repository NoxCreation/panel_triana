import { ServiceType } from "@/types/ServiceType";
import { Stack, Divider, Text, Badge, HStack, Wrap, WrapItem, List, ListItem, ListIcon, Box } from "@chakra-ui/react";
import { CheckIcon, NotAllowedIcon } from "@chakra-ui/icons"; // o cualquier otro icono
import HtmlRenderer from "@/components/htmlRenderer";

// Formatear precio a moneda
const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR", // o USD, según tu caso
        minimumFractionDigits: 2,
    }).format(price);
};

// Mapeo de tipos a etiquetas legibles
const typeLabels: Record<ServiceType["type"], string> = {
    weekly: "Semanal",
    diary: "Diario",
    single_payment: "Pago único",
    session: "Por sesión",
    monthly: "Mensual",
};

export const ServiceDetails = ({ service }: { service: ServiceType }) => {
    console.log("serviceDD", service)
    return (
        <Stack spacing={3} divider={<Divider />}>
            {/* Título y tipo */}
            <Box>
                <HStack justify="space-between" wrap="wrap" mb={2}>
                    <Text fontSize="xl" fontWeight="bold">
                        {service.title}
                    </Text>
                    <Badge variant={'subtle'} colorScheme="blue" fontSize="xs" borderRadius="full">
                        {typeLabels[service.type]}
                    </Badge>
                </HStack>
                <Text fontSize="md" color="gray.600">
                    <HtmlRenderer>
                        {service.description}
                    </HtmlRenderer>
                </Text>
            </Box>

            {/* Precio */}
            <Box>
                <Text fontWeight="semibold" mb={1}>
                    Precio
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                    {formatPrice(service.price)}
                </Text>
            </Box>

            {/* Tiquet (etiquetas/badges) */}
            {service.tiquet && service.tiquet.length > 0 && (
                <Box>
                    <Text fontWeight="semibold" mb={2}>
                        Etiquetas
                    </Text>
                    <Wrap spacing={2}>
                        {service.tiquet.map((tag, idx) => (
                            <WrapItem key={idx}>
                                <Badge
                                    colorScheme={tag.variant === "primary" ? "teal" : "gray"}
                                    variant={tag.variant === "outline" ? "outline" : "solid"}
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                >
                                    {tag.label}
                                </Badge>
                            </WrapItem>
                        ))}
                    </Wrap>
                </Box>
            )}

            {/* Incluye */}
            {service.include && service.include.length > 0 && (
                <Box>
                    <Text fontWeight="semibold" mb={2}>
                        Incluye
                    </Text>
                    <List spacing={1}>
                        {service.include.map((item, idx) => (
                            <ListItem key={idx}>
                                <ListIcon as={CheckIcon} color="green.500" />
                                {item}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* No incluye */}
            {service.notInclude && service.notInclude.length > 0 && (
                <Box>
                    <Text fontWeight="semibold" mb={2}>
                        No incluye
                    </Text>
                    <List spacing={1}>
                        {service.notInclude.map((item, idx) => (
                            <ListItem key={idx}>
                                <ListIcon as={NotAllowedIcon} color="red.500" />
                                {item}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Requisitos */}
            {(service.requirement && service.requirement.length > 0) && (
                <Box>
                    <Text fontWeight="semibold" mb={2}>
                        {service.requireLabel || "Requisitos"}
                    </Text>
                    <List spacing={1} styleType="disc" pl={5}>
                        {service.requirement.map((req, idx) => (
                            <ListItem key={idx}>{req}</ListItem>
                        ))}
                    </List>
                </Box>
            )}
        </Stack>
    );
};