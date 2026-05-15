import {
    Box, Heading, Flex, Card, CardBody, Text
} from '@chakra-ui/react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import React from 'react';
import { Tooltip as ReactTooltip } from "react-tooltip";
import { scaleLinear } from 'd3-scale';
import { TopCountry } from '../types';

// Paleta de colores para el mapa
const colorScale = scaleLinear<string>()
    .domain([0, 1000, 5000])
    .range(['#ffedea', '#ff5123', '#b00b1a']);

export const HeatMap = ({
    topCountries
}: {
    topCountries: TopCountry[]
}) => {

    return (
        <Card >
            <CardBody>
                <Heading as="h2" size="md" mb={4}>
                    Mapa de calor de visitas por país
                </Heading>
                <Box height="450px" width="100%" position="relative">
                    <ComposableMap
                        projectionConfig={{ scale: 147 }}
                        width={800}
                        height={450}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <Geographies geography="/world-110m.json">
                            {({ geographies }) =>
                                geographies.map(geo => {
                                    // Obtener código ISO y nombre del país
                                    const countryCode = geo.properties.iso_a2;
                                    if (!countryCode) return null;
                                    const countryData = topCountries.find(c => c.code === countryCode);
                                    const visits = countryData ? countryData.visits : 0;
                                    const fillColor = visits === 0 ? '#d3d3d3' : colorScale(visits);
                                    const countryName = geo.properties.name || geo.properties.admin || countryCode;

                                    // ⚡️ Renderizado optimizado con memo
                                    const MemorizedGeography = React.memo(Geography);

                                    return (
                                        <MemorizedGeography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            fill={fillColor}
                                            stroke="#D6D6DA"
                                            strokeWidth={0.5}
                                            data-tooltip-id="country-tooltip"
                                            data-tooltip-content={`${countryName}: ${visits} visitas`}
                                            style={{
                                                default: { outline: 'none' },
                                                hover: { fill: '#F53', outline: 'none' },
                                                pressed: { outline: 'none' },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ComposableMap>
                    <ReactTooltip id="country-tooltip" place="top" />
                </Box>

                {/* Leyenda (igual que la tuya) */}
                <Flex justify="center" mt={4} gap={6} wrap="wrap" align="center">
                    <Box display="flex" alignItems="center">
                        <Box w="20px" h="20px" bg="#d3d3d3" mr={2} borderRadius="sm" />
                        <Text fontSize="sm">Sin visitas</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box w="20px" h="20px" bg="#ffedea" mr={2} borderRadius="sm" />
                        <Text fontSize="sm">Menos visitas</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box w="20px" h="20px" bg="#ff5123" mr={2} borderRadius="sm" />
                        <Text fontSize="sm">Visitas medias</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Box w="20px" h="20px" bg="#b00b1a" mr={2} borderRadius="sm" />
                        <Text fontSize="sm">Más visitas</Text>
                    </Box>
                </Flex>
                <Text fontSize="sm" color="gray.500" mt={3} textAlign="center">
                    Los países sin datos aparecen en gris. La intensidad del color rojo es proporcional a la cantidad de visitas.
                </Text>
            </CardBody>
        </Card>
    )
}