import { ContainerSystem } from "@/components/ContainerSystem";
import { useGetProfile } from "@/hooks/useGetProfile";
import { useFetch } from "@/hooks/useFetch";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { CardBanner } from "./components/CardBanner";
import { MetricCard } from "./components/MetricCard";
import {
    FaUsers,
    FaDollarSign,
    FaPercentage,
    FaShoppingCart,
    FaMoneyBillWave,
    FaChartLine,
    FaWallet,
    FaBox,
} from "react-icons/fa";
import { Transition } from "@/components/Transition";
import Particles from "@/components/Particles";
import {
    Flex,
    Heading,
    Stack,
    Box,
    IconButton,
} from "@chakra-ui/react";
import { FiRefreshCcw } from "react-icons/fi";

export default function HomeIndex() {
    const profile = useGetProfile()

    return (
        <ContainerSystem
            navBarControl={
                <Flex align="center" justify="space-between" w="100%" wrap="wrap" gap={2}>
                    <Heading size="lg">Bienvenido, {profile?.first_name}!</Heading>
                    <Box minW="300px">
                        {/* <DateRangeSelector value={range} onChange={handleDateChange} /> */}
                    </Box>
                </Flex>
            }
        >

            {/* Fondo de partículas */}
            <Stack
                position="fixed"
                left={0}
                top={0}
                w="100vw"
                h="100vh"
                zIndex={0}
            >
                <Particles
                    particleColors={['#e879f9', '#a21caf']} 
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={false}
                    alphaParticles={false}
                    disableRotation={false}
                    className="particles-container"
                />
            </Stack>

            <Stack spacing={2} position="relative" zIndex={1}>
                {/* Sección superior: Banner y métricas clave (manteniendo tu diseño) */}
                <Flex gap={2} direction={{ base: 'column', lg: 'row' }}>
                    <Box flex={3} position={"relative"}>
                        <CardBanner />
                        <IconButton
                            aria-label=""
                            icon={<FiRefreshCcw />}
                            position={'absolute'}
                            top={0}
                            right={0}
                            m={2}
                            onClick={()=>{}}
                            isLoading={false}
                            zIndex={4}
                        />
                    </Box>

                    
                </Flex>

            </Stack>
        </ContainerSystem>
    );
}