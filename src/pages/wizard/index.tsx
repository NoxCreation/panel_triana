import LoadSuspense from "@/components/LoadSuspense";
import { GetServerSideProps } from "next";
import { prisma } from "@/utils/prisma";

export default function Wizard() {
  return (
    <LoadSuspense load={() => import('@/modules/Wizard')}
      params={{
      }}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const countUsers = await prisma.user.count()
  if (countUsers > 0) { // Ir a la autenticacion
    return { redirect: { destination: `/auth`, permanent: false } };
  }

  return {
    props: {
    },
  }
}

