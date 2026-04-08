import LoadSuspense from "@/components/LoadSuspense";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import is_auth from "@/utils/middlewares/is_auth";

export default function ServicesPayments() {
  return (
    <MainLayout screenTitle="Servicios de Pago">
      <LoadSuspense load={() => import('@/modules/ServicesPayments')}
        params={{

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

  return {
    props: {
    },
  }
}

