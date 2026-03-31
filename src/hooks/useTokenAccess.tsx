import { useSession } from "next-auth/react";

export const useTokenAccess = () => {
    const { data: session } = useSession();
    if (session)
        return {
            token: (session?.user as any).tokenAccess
        }
    else
        return {
            token: ""
        }
}