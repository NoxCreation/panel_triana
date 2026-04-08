// CountryFlag.tsx - Versión con imágenes CDN
import { HStack, Image, Text } from '@chakra-ui/react';

interface CountryFlagProps {
    countryCode: string;
    /** Tamaño de la imagen en px (por defecto 24) */
    flagSize?: number;
    /** Idioma para el nombre del país (por defecto 'es') */
    locale?: string;
}

const getCountryName = (countryCode: string, locale: string): string => {
    try {
        const displayNames = new Intl.DisplayNames([locale], { type: 'region' });
        const name = displayNames.of(countryCode.toUpperCase());
        return name || countryCode;
    } catch {
        return countryCode;
    }
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
    countryCode,
    flagSize = 24,
    locale = 'es',
}) => {
    if (!countryCode || countryCode.length !== 2) {
        return (
            <HStack spacing={2}>
                <Text>🏳️</Text>
                <Text>Código inválido</Text>
            </HStack>
        );
    }

    const code = countryCode.toUpperCase();
    const flagUrl = `https://flagcdn.com/w40/${code.toLowerCase()}.png`; // PNG
    // Alternativa SVG (mejor calidad):
    // const flagUrl = `https://flagcdn.com/${code.toLowerCase()}.svg`;
    const countryName = getCountryName(code, locale);

    return (
        <HStack spacing={2}>
            <Image
                src={flagUrl}
                alt={`Bandera de ${countryName}`}
                width={`${flagSize}px`}
                height="auto"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/24x16?text=?"
            />
            <Text fontWeight="medium">{countryName}</Text>
        </HStack>
    );
};