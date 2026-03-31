import LoadSuspense from "@/components/LoadSuspense";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import is_auth from "@/utils/middlewares/is_auth";
import { prisma } from "@/utils/prisma";
import { getToken } from "next-auth/jwt";
import { UserType } from "@/types/UserType";

export default function Profile({
    user
}: {
    user: UserType
}) {
    return (
        <MainLayout screenTitle="Profile">
            <LoadSuspense load={() => import('@/modules/Profile')}
                params={{
                    user
                }}
            />
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { req } = context;
    const isauth = await is_auth(req);

    if (!isauth) {
        return { redirect: { destination: '/401', permanent: false } };
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const {
        id,
    } = token

    const user = await prisma.user.findUnique({
        where: {
            id: id as string
        }
    })

    return {
        props: {
            user: {
                ...user,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            }
        },
    }
}

