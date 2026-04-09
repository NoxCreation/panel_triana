import { Box } from "@chakra-ui/react";
import {
    CiCreditCard1,
    CiDollar,
    CiGrid41,
    CiPenpot,
    CiReceipt,
    CiShop,
    CiShoppingBasket,
    CiUser,
    CiViewTimeline,
} from "react-icons/ci";
import { FiAirplay, FiBookOpen } from "react-icons/fi";

export const list_menu = [
    {
        icon: (
            <Box
                bg={'red.500'}
                p={2} borderRadius={'full'}
            >
                <CiGrid41 size={'20px'} />
            </Box>
        ),
        label: "Principal",
        prefix: 'home',
        link: "/home",
        matchLinks: []
    },
    {
        icon: (
            <Box
                bg={'teal.500'}
                p={2} borderRadius={'full'}
            >
                <FiAirplay size={'20px'} />
            </Box>
        ),
        label: "Landing Page",
        prefix: 'landing',
        subitems: [
            { label: "Datos de Página", link: "/landing", prefix: 'data_landing' },
            { label: "Posibles Clientes", link: "/leads", prefix: 'lead_landing' },
            { label: "Blog", link: "/blog", prefix: 'blog_landing' },
            { label: "Pagos de Servicios", link: "/services_payments", prefix: 'services_payments_landing' },
        ],
        matchLinks: [
            '/landing',
            '/leads',
            '/blog',
            '/services',
        ]
    },
    {
        icon: (
            <Box
                bg={'pink.500'}
                p={2} borderRadius={'full'}
            >
                <CiUser size={'20px'} />
            </Box>
        ),
        label: "Usuarios",
        prefix: 'persons',
        link: "/users",
        matchLinks: []
    },
    {
        icon: (
            <Box
                bg={'cyan.500'}
                p={2} borderRadius={'full'}
            >
                <CiReceipt size={'20px'} />
            </Box>
        ),
        label: "Políticas de Privacidad Web",
        prefix: 'privacy_policy_web',
        link: "/privacy-policy-web",
        matchLinks: []
    },

]

