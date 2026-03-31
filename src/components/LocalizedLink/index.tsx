import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

type LocalizedLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
    // Añade cualquier otra prop que necesites
} & LinkProps

export default function LocalizedLink({ href, children, ...props }: LocalizedLinkProps) {
    const router = useRouter();

    return (
        <Link
            href={href}
            locale={router.locale} // Mantiene el mismo idioma al navegar
            {...props}
        >
            {children}
        </Link>
    );
}

