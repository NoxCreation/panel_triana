import { Stack, StackProps } from "@chakra-ui/react"
import { ReactNode } from "react";

type FormProps = {
    onSubmit: any
    children: ReactNode,
    ref?: any
} & StackProps

export const Form: React.FC<FormProps> = ({ onSubmit, children, ref, ...props }) => {
    return (
        <Stack spacing={2} flex={1} justifyContent={'center'} as={'form'} onSubmit={onSubmit} ref={ref} {...props}>
            {children}
        </Stack>
    );
};