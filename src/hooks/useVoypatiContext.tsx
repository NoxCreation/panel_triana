import { VoypatiContext } from "@/providers/VoypatiProvider";
import { useContext } from "react";

function useVoypatiContext() {
    const context = useContext(VoypatiContext);
    if (!context) {
        throw new Error(
            "usePermissions must be used within a VoypatiProvider"
        );
    }
    return {
        collapseMenu: context.collapseMenu,
        setCollapseMenu: context.setCollapseMenu
    };
}

export default useVoypatiContext
