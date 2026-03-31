import { ProfileJWTType } from "@/types/ProfileType";
import { useSession } from "next-auth/react";

export const useGetProfile = (): ProfileJWTType | undefined => {
    const { data: session } = useSession();

    if (session)
        return {
            ...session.user as any
        }
    else
        return undefined
}