import {
    Card,
    CardBody,
    Stat,
    StatLabel,
    StatHelpText,
    Flex,
    Box,
    Icon,
    Text,
    Badge,
    Skeleton,
    Tooltip,
} from "@chakra-ui/react";
import NumberFlow from "@number-flow/react";
import { ReactElement } from "react";

interface MetricCardProps {
    // Contenido principal
    title: string;
    value: string | number;

    // Icono
    icon?: ReactElement;
    iconColor?: string;

    // Estado y variaciones
    variant?: 'solid' | 'gradient' | 'outline';
    colorScheme?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray' | 'green';

    // Información adicional
    subtitle?: string;
    change?: number; // Porcentaje de cambio
    changeLabel?: string; // Texto personalizado para el cambio
    isLoading?: boolean;
    precision?: number; // Decimales para el valor

    // Badge/tag
    badge?: string;
    badgeColor?: string;

    // Tooltip
    tooltip?: string;

    // Acciones
    onClick?: () => void;
}

export const MetricCard = ({
    title,
    value,
    icon,
    iconColor,
    variant = 'solid',
    colorScheme = 'primary',
    subtitle,
    change,
    changeLabel,
    isLoading = false,
    precision,
    badge,
    badgeColor,
    tooltip,
    onClick
}: MetricCardProps) => {

    // Colores según el scheme
    const colorSchemes = {
        primary: { bg: 'white', border: 'primary.300', text: 'primary.800', icon: 'primary.500' },
        success: { bg: 'white', border: 'green.300', text: 'green.800', icon: 'green.500' },
        warning: { bg: 'white', border: 'orange.300', text: 'orange.800', icon: 'orange.500' },
        danger: { bg: 'white', border: 'red.300', text: 'red.800', icon: 'red.500' },
        info: { bg: 'white', border: 'blue.300', text: 'blue.800', icon: 'blue.500' },
        gray: { bg: 'white', border: 'gray.300', text: 'gray.800', icon: 'gray.500' },

        // colores
        green: { bg: 'white', border: 'green.300', text: 'green.800', icon: 'green.500' },
    };

    const colors = colorSchemes[colorScheme];

    // Formatear valor numérico
    const formatValue = (val: string | number) => {
        if (typeof val === 'number' && precision !== undefined) {
            return val.toFixed(precision);
        }
        return val;
    };

    // Estilos según variant
    const getVariantStyles = () => {
        switch (variant) {
            case 'gradient':
                return {
                    bgGradient: `linear(to-r, ${colorScheme}.50, ${colorScheme}.100)`,
                    border: 'none'
                };
            case 'outline':
                return {
                    bg: 'white',
                    border: '2px solid',
                    borderColor: colors.border
                };
            default: // solid
                return {
                    bg: colors.bg,
                    borderLeft: '4px solid',
                    borderLeftColor: colors.border
                };
        }
    };

    // Color del icono
    const resolvedIconColor = iconColor || colors.icon;

    return (
        <Tooltip label={tooltip} isDisabled={!tooltip} hasArrow placement="top">
            <Card
                {...getVariantStyles()}
                cursor={onClick ? 'pointer' : 'default'}
                onClick={onClick}
                role={onClick ? 'button' : undefined}
                tabIndex={onClick ? 0 : undefined}
                p={0}
            >
                <CardBody py={2}>
                    <Stat>
                        <Flex justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <StatLabel
                                    fontSize="sm"
                                    fontWeight="medium"
                                    color={colors.text}
                                    opacity={0.9}
                                >
                                    {title}
                                </StatLabel>

                                {badge && (
                                    <Badge
                                        mt={1}
                                        colorScheme={badgeColor || colorScheme}
                                        variant="subtle"
                                        fontSize="xs"
                                    >
                                        {badge}
                                    </Badge>
                                )}
                            </Box>

                            {icon && (
                                <Icon
                                    as={icon.type as any}
                                    boxSize={5}
                                    color={resolvedIconColor}
                                    opacity={0.8}
                                />
                            )}
                        </Flex>

                        <Skeleton isLoaded={!isLoading} height={isLoading ? '40px' : 'auto'}>
                            <NumberFlow value={formatValue(value) as any}
                                style={{
                                    fontSize: '25px',
                                    fontWeight: 'bold',
                                    color: '#4A5568'
                                }}
                            />
                        </Skeleton>

                        {(subtitle || change !== undefined || changeLabel) && (
                            <StatHelpText fontSize="sm" mt={1}>
                                <Flex alignItems="center" gap={2}>
                                    {subtitle && (
                                        <Text color={`${colorScheme}.600`} opacity={0.8}>
                                            {subtitle}
                                        </Text>
                                    )}

                                    {(change !== undefined || changeLabel) && (
                                        <Flex alignItems="center" gap={1}>
                                            {change !== undefined && (
                                                <Icon
                                                    as={change >= 0 ? '↑' : '↓' as any}
                                                    color={change >= 0 ? 'green.500' : 'red.500'}
                                                    boxSize={3}
                                                />
                                            )}
                                            <Text
                                                fontSize="xs"
                                                fontWeight="semibold"
                                                color={change !== undefined ?
                                                    (change >= 0 ? 'green.600' : 'red.600') :
                                                    `${colorScheme}.600`
                                                }
                                            >
                                                {changeLabel || (change !== undefined ? `${Math.abs(change)}%` : '')}
                                            </Text>
                                        </Flex>
                                    )}
                                </Flex>
                            </StatHelpText>
                        )}
                    </Stat>
                </CardBody>
            </Card>
        </Tooltip>
    );
};

// Componente para grupo de métricas
interface MetricGridProps {
    children: React.ReactNode;
    columns?: { base: number; md: number; lg: number };
    spacing?: number | string;
}

export const MetricGrid = ({
    children,
    columns = { base: 1, md: 2, lg: 4 },
    spacing = 4
}: MetricGridProps) => {
    return (
        <Box
            display="grid"
            gridTemplateColumns={{
                base: `repeat(${columns.base}, 1fr)`,
                md: `repeat(${columns.md}, 1fr)`,
                lg: `repeat(${columns.lg}, 1fr)`
            }}
            gap={spacing}
            width="100%"
        >
            {children}
        </Box>
    );
};