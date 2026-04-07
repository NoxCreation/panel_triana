

import { Button, Flex, Stack, TabPanel, IconButton, useDisclosure, Tooltip, Tag } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { FormInput } from "../FormControls/FormInput";
import { HeadingTitle } from "../FormControls/HeadingTitle";
import { FormTextarea } from "../FormControls/FormTextarea";
import { ContentType } from "@/types/ContentType";
import { DataTable, DataTableRef } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { CustomColumnDef } from "@/types/CustomColumnDef";
import { CustomDrawer } from "@/components/CustomDrawer";
import { FormService, ServiceType } from "../FormService";
import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable";
import { CiEdit } from "react-icons/ci";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export const TabProcess = ({
    content,
    isLoading,
    onChangeContent,
    onSaveContent
}: {
    content: ContentType
    isLoading: boolean
    onChangeContent: (key: string, new_content: { [key: string]: any }) => void
    onSaveContent: () => void
}) => {
    

    return (
        <TabPanel>
            <>En construccion</>
        </TabPanel>
    )
}
