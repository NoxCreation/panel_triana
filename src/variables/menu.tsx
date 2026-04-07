import { Box } from "@chakra-ui/react";
import {
    CiCreditCard1,
    CiDollar,
    CiGrid41,
    CiPenpot,
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
        link: "/landing",
        matchLinks: []
    },
    {
        icon: (
            <Box
                bg={'blue.500'}
                p={2} borderRadius={'full'}
            >
                <FiBookOpen size={'20px'} />
            </Box>
        ),
        label: "Blog",
        prefix: 'blog',
        link: "/blog",
        matchLinks: []
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
        prefix: 'users',
        link: "/users",
        matchLinks: []
    },
    /* {
        icon: <CiViewTimeline size={'20px'} />,
        label: "Landing Page",
        prefix: 'landing',
        subitems: [
            { label: "Home", link: "/articles/fundamentals", prefix: 'articles_fundamentals' },
            { label: "Sex Education", link: "/articles/sex_education", prefix: 'articles_sex_education' },
            { label: "Aches and Pain", link: "/articles/aches_and_pain", prefix: 'articles_aches_and_pain' },
            { label: "Nutrition", link: "/articles/nutrition", prefix: 'articles_nutrition' }
        ],
        matchLinks: [
            '/articles/fundamentals',
            '/articles/sex_education',
            '/articles/aches_and_pain',
            '/articles/nutrition'
        ]
    }, */
]

