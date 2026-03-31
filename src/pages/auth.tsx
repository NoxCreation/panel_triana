import LoadSuspense from "@/components/LoadSuspense";
import is_auth from "@/utils/middlewares/is_auth";
import { prisma } from "@/utils/prisma";
import { GetServerSideProps } from "next";

export default function Auth() {

    return (
        <LoadSuspense load={() => import('@/modules/Auth')} />
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context
    const isauth = await is_auth(req)
    if (isauth)
        return { redirect: { destination: `/home`, permanent: false } };

    const countUsers = await prisma.user.count()
    if (countUsers == 0) { // Ir a la instalacion
        return { redirect: { destination: `/wizard`, permanent: false } };
    }

    return {
        props: {
        }
    }
}
