import { useColorModeValue, Card, CardBody, Stat, StatLabel, StatNumber } from "@chakra-ui/react";

export function MetricCard({ title, value }: { title: string; value: string | number }) {
    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    return (
        <Card bg={bg} borderColor={borderColor}>
            <CardBody>
                <Stat>
                    <StatLabel fontSize="sm" color="gray.500" fontWeight="medium">{title}</StatLabel>
                    <StatNumber fontSize="3xl" fontWeight="bold">{value}</StatNumber>
                </Stat>
            </CardBody>
        </Card>
    );
}