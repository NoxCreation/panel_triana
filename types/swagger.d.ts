declare module 'swagger-ui-react' {
    import { ComponentType } from 'react';

    interface SwaggerUIProps {
        url?: string;
        spec?: any;
        docExpansion?: 'list' | 'full' | 'none';
        defaultModelExpandDepth?: number;
        displayRequestDuration?: boolean;
    }

    const SwaggerUI: ComponentType<SwaggerUIProps>;
    export default SwaggerUI;
}