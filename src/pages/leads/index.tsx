import LoadSuspense from "@/components/LoadSuspense";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import is_auth from "@/utils/middlewares/is_auth";

export default function Leads() {
  return (
    <MainLayout screenTitle="Leads">
      <LoadSuspense load={() => import('@/modules/Leads')}
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

