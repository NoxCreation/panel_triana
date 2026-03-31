import { LoadingSuspense } from '@/components/LoadSuspense/LoadingSuspense';
import { Box } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

// Importar SwaggerUI dinámicamente para evitar problemas de SSR
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
    ssr: false,
    loading: () => <LoadingSuspense />
});

export default function ApiDoc() {
    return (
        <Box bg="gray.50">
            <SwaggerUI url={"/api/swagger.json" as any} />
        </Box>
    );
}