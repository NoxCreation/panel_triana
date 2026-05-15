import {
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatNumber,
    HStack,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Text,
    Box,
    Flex,
    useColorModeValue
} from "@chakra-ui/react";
import { InfoIcon, ViewIcon, AtSignIcon, TimeIcon, RepeatIcon } from "@chakra-ui/icons";

const getIcon = (title: string) => {
    if (title.includes("Visitas totales")) return <ViewIcon />;
    if (title.includes("Visitantes únicos")) return <AtSignIcon />;
    if (title.includes("Tasa de rebote")) return <RepeatIcon />;
    if (title.includes("Páginas vistas")) return <TimeIcon />;
    return <ViewIcon />;
};

export function MetricCard({ title, value, description }: { title: string; value: string | number; description: string }) {

    return (
        <Card
            position="relative"
            overflow="hidden"
            transition="all 0.3s ease"
        >
            <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                height="4px"
                bgGradient={`linear(to-r, primary.500, primary.300)`}
            />
            <CardBody pt={4}>
                <Stat>
                    <Flex justify="space-between" align="center" mb={2}>
                        <HStack spacing={2} alignItems={"center"}>
                            <Box color={"primary.500"} fontSize="md">
                                {getIcon(title)}
                            </Box>
                            <StatLabel fontSize="sm" fontWeight="semibold" color={"gray.400"} letterSpacing="wide">
                                {title}
                            </StatLabel>
                        </HStack>
                        <Popover trigger="hover" placement="right">
                            <PopoverTrigger>
                                <IconButton
                                    aria-label="Información"
                                    icon={<InfoIcon />}
                                    size="xs"
                                    variant="ghost"
                                    color="gray.400"
                                    _hover={{ color: "primary.500", bg: "transparent" }}
                                    borderRadius="full"
                                />
                            </PopoverTrigger>
                            <PopoverContent width="auto" maxW="220px">
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverBody fontSize="sm" p={3}>
                                    <Text>{description}</Text>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </Flex>
                    <StatNumber fontSize="3xl" fontWeight="extrabold" lineHeight="1.2" letterSpacing="tight">
                        {value}
                    </StatNumber>
                </Stat>
            </CardBody>
        </Card>
    );
}