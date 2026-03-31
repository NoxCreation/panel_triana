"use client";

import {
    Stack,
    Image,
    Flex,
    Text,
    Box,
    Collapse,
    useDisclosure,
    Button,
    Tooltip,
    useBoolean,
    IconButton,
    useColorMode,
    useBreakpointValue,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
} from "@chakra-ui/react";
import { FiChevronDown, FiChevronUp, FiChevronLeft, FiChevronRight, FiMenu } from "react-icons/fi";
import { cloneElement, Fragment, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { list_menu } from "@/variables/menu";
import { useRouter } from "next/router";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import React from "react";
import useVoypatiContext from "@/hooks/useVoypatiContext";
import LocalizedLink from "../LocalizedLink";
import { LinkProps } from "next/link";
import { useTranslation } from "react-i18next";
import { useGetProfile } from "@/hooks/useGetProfile";
import { ProfileButton } from "./Navbar/ProfileButton";

export const router_permission = {
    ADMIN: [
        'home', 'users', 'landing'
    ],
};

// Componente que renderiza el listado de menú (reutilizable)
const MenuContent = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const pathname = usePathname();
    const { t } = useTranslation("common");
    const profile = useGetProfile();
    const role = 'ADMIN';

    return (
        <Stack mt={5} overflowY={isCollapsed ? 'auto' : "scroll"} h={"100%"} className="custom-scroll">
            {list_menu.filter(e => router_permission[role]?.includes(e.prefix)).map((m: any, index) => (
                <Fragment key={index}>
                    {m.subitems ? (
                        <ButtonMenu
                            isCollapsed={isCollapsed}
                            active={
                                m.subitems.map((y) => y.link).includes(pathname) ||
                                m.matchLinks.find((m) => m == pathname) != undefined
                            }
                            icon={m.icon}
                            label={t(m.label, { ns: 'common' })}
                            href={"#"}
                            onClick={(event) => event.preventDefault()}
                            noMark={!isCollapsed}
                        >
                            {m.subitems.map((e, index2) => (
                                <ButtonMenu
                                    isCollapsed={isCollapsed}
                                    active={pathname == e.link}
                                    key={index2}
                                    icon={<Box w={"24px"} />}
                                    label={t(e.label, { ns: 'common' })}
                                    href={e.link}
                                    module_prefix={m.prefix}
                                    submodule_prefix={e.prefix}
                                />
                            ))}
                        </ButtonMenu>
                    ) : (
                        <ButtonMenu
                            isCollapsed={isCollapsed}
                            active={pathname == m.link || m.matchLinks.find((m) => m == pathname) != undefined}
                            icon={m.icon}
                            label={t(m.label, { ns: 'common' })}
                            href={m.link}
                        />
                    )}
                </Fragment>
            ))}
        </Stack>
    );
};

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { collapseMenu, setCollapseMenu } = useVoypatiContext();
    const [isCollapsed, { toggle: toggleCollapse }] = useBoolean(collapseMenu);
    const { colorMode } = useColorMode();
    const { t } = useTranslation("common");
    const profile = useGetProfile();
    const role = profile?.role ? profile?.role : 'ADMIN';

    const isMobile = useBreakpointValue({ base: true, md: false });
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

    // Versión desktop: sidebar fijo
    if (!isMobile) {
        return (
            <Stack
                bg={colorMode == 'light' ? "white" : "gray.700"}
                w={isCollapsed ? "80px" : "260px"}
                maxW={isCollapsed ? "80px" : "260px"}
                position={"fixed"}
                zIndex={2}
                h={"100vh"}
                borderRight={'1px solid'}
                borderColor={'gray.100'}
                transition="all 0.3s ease"
                spacing={0}
            >
                <Flex justifyContent={"left"} pt={10} px={isCollapsed ? '20px' : 10}>
                    <LocalizedLink href={"/home"}>
                        {isCollapsed ? (
                            <Image src="/isologo-icon2.svg" w={"36px"} alt="" />
                        ) : (
                            <Image src="/isologo2.svg" w={"140px"} alt="" />
                        )}
                    </LocalizedLink>
                </Flex>

                <IconButton
                    aria-label="Toggle sidebar"
                    icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
                    onClick={() => {
                        toggleCollapse();
                        setCollapseMenu(!collapseMenu);
                    }}
                    position="absolute"
                    right={-4}
                    top={10}
                    boxShadow="md"
                    borderRadius="full"
                    size="sm"
                    zIndex={1}
                />

                <MenuContent isCollapsed={isCollapsed} />
            </Stack>
        );
    }

    // Versión mobile: botón hamburguesa + Drawer
    return (
        <>
            <Flex
                position="fixed"
                top={0}
                left={0}
                pt={4}
                w={'100%'}
                zIndex={10}
                bg={'white'}
            >
                <Stack flex={1} alignItems={'start'} px={"16px"}>
                    <IconButton
                        aria-label="Open menu"
                        icon={<FiMenu />}
                        onClick={onDrawerOpen}
                        variant="ghost"
                        size="lg"
                    />
                </Stack>

                <Stack>
                    <ProfileButton />
                </Stack>
            </Flex>
            <Drawer isOpen={isDrawerOpen} placement="left" onClose={onDrawerClose} size="xs">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth="1px">
                        <LocalizedLink href={"/home"} onClick={onDrawerClose}>
                            <Image src="/isologo2.svg" w={"140px"} alt="" />
                        </LocalizedLink>
                    </DrawerHeader>
                    <DrawerBody p={0}>
                        <MenuContent isCollapsed={false} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

// El componente ButtonMenu permanece igual (sin cambios)
type ButtonMenuProps = {
    active?: boolean;
    noMark?: boolean;
    href: string;
    icon: ReactNode;
    label: string;
    children?: ReactNode;
    isCollapsed?: boolean;
    forceShowLabel?: boolean;
    module_prefix?: string;
    submodule_prefix?: string;
} & LinkProps;

const ButtonMenu = ({
    active = false,
    noMark = false,
    href,
    icon,
    label,
    children,
    isCollapsed = false,
    forceShowLabel = false,
    ...props
}: ButtonMenuProps) => {
    const { colorMode } = useColorMode();
    const newIcon = cloneElement(icon as React.ReactElement, {
        color: active && !noMark ? "#ffffff" : "#ffffff",
    });

    const { isOpen: isExpanded, onToggle: onToggleExpand } = useDisclosure({
        defaultIsOpen: active,
    });

    if (!children) {
        return (
            <LocalizedLink {...props} href={href}>
                <Tooltip label={label} placement="right" isDisabled={!isCollapsed} hasArrow>
                    <Flex
                        gap={isCollapsed ? 0 : 8}
                        minH={"45px"}
                        alignItems={"center"}
                        flex={1}
                        pr={4}
                        cursor={"pointer"}
                        _hover={{ bg: "gray.100" }}
                        fontSize={"13px"}
                        justifyContent={isCollapsed ? "center" : "flex-start"}
                        bg={active ? 'primary.50' : ''}
                    >
                        <Box
                            id={"MarkU"}
                            bg={active && !noMark ? "primary.600" : "transparent"}
                            w={"5px"}
                            h={"40px"}
                            borderRadius={"0 10px 10px 0"}
                        />
                        <Flex
                            gap={isCollapsed ? 0 : 2}
                            flex={1}
                            alignItems="center"
                            justifyContent={isCollapsed ? "center" : "flex-start"}
                            ml={isCollapsed ? 2 : 0}
                            color={active && !noMark ? "primary.600" : (colorMode == 'light' ? "gray.400" : 'gray.100')}
                        >
                            {newIcon}
                            {(!isCollapsed || forceShowLabel) && <Text>{label}</Text>}
                        </Flex>
                    </Flex>
                </Tooltip>
            </LocalizedLink>
        );
    }

    if (isCollapsed) {
        return (
            <Menu isLazy placement="right-start">
                <Tooltip label={label} placement="right" isDisabled={!isCollapsed} hasArrow>
                    <MenuButton
                        as={Button}
                        variant="ghost"
                        w="full"
                        p={0}
                        _hover={{ bg: "gray.100" }}
                        _expanded={{ bg: "gray.100" }}
                        borderRadius={"0"}
                        minH={"45px"}
                        alignItems={'center'}
                    >
                        <Flex>
                            {active && <Box
                                mt={'3px'}
                                bg={active && !noMark ? "primary.600" : "transparent"}
                                w={"5px"}
                                h={"40px"}
                                borderRadius={"0 10px 10px 0"}
                            />}
                            <Flex
                                color={active && !noMark ? "primary.600" : (colorMode == 'light' ? "gray.400" : 'gray.100')}
                                gap={0}
                                alignItems={"center"}
                                justifyContent="center"
                                w="full"
                                minH={"45px"}
                                bg={active ? 'primary.50' : ''}
                            >
                                {newIcon}
                            </Flex>
                        </Flex>
                    </MenuButton>
                </Tooltip>

                <MenuList zIndex={9999} minW="200px" boxShadow="xl" py={1} borderColor="gray.200">
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            let childElement = child;
                            if (
                                childElement.props &&
                                childElement.props.children &&
                                React.isValidElement(childElement.props.children)
                            ) {
                                childElement = childElement.props.children;
                            }
                            const { href, label: itemLabel, active: itemActive } = childElement.props || {};

                            if (href && itemLabel) {
                                return (
                                    <MenuItem as={LocalizedLink} href={href} _hover={{ bg: "gray.100" }} zIndex={9999}>
                                        <Flex gap={2} alignItems="center" w="100%" py={1}>
                                            <Text color={itemActive ? "primary.600" : (colorMode == 'light' ? "gray.500" : 'gray.100')}>{itemLabel}</Text>
                                        </Flex>
                                    </MenuItem>
                                );
                            }
                        }
                        return null;
                    })}
                </MenuList>
            </Menu>
        );
    }

    return (
        <Stack>
            <LocalizedLink
                {...props}
                href={"#"}
                onClick={(e) => {
                    e.preventDefault();
                    onToggleExpand();
                }}
            >
                <Flex
                    color={active && !noMark ? "primary.600" : "gray.400"}
                    gap={8}
                    minH={"45px"}
                    alignItems={"center"}
                    flex={1}
                    pr={4}
                    cursor={"pointer"}
                    _hover={{ bg: "gray.100" }}
                    fontSize={"13px"}
                    justifyContent="flex-start"
                >
                    <Box
                        bg={active && !noMark ? "primary.600" : "transparent"}
                        w={"5px"}
                        h={"40px"}
                        borderRadius={"0 10px 10px 0"}
                    />
                    <Flex gap={2} flex={1} alignItems="center">
                        {newIcon}
                        <Text>{label}</Text>
                    </Flex>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </Flex>
            </LocalizedLink>

            <Collapse in={isExpanded} animateOpacity>
                {children}
            </Collapse>
        </Stack>
    );
};