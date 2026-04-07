import LoadSuspense from "@/components/LoadSuspense";
import MainLayout from "@/components/Layout/MainLayout";
import { GetServerSideProps } from "next";
import is_auth from "@/utils/middlewares/is_auth";
import { prisma } from "@/utils/prisma";
import { ArticleType } from "@/types/ArticleType";

export default function BlogEdit({
  article
}: {
  article: ArticleType
}) {
  return (
    <MainLayout screenTitle="Blog Edit">
      <LoadSuspense load={() => import('@/modules/Blog/ArticleCreate')}
        params={{
          article
        }}
      />
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, params } = context;
  const isauth = await is_auth(req);

  if (!isauth) {
    return { redirect: { destination: '/401', permanent: false } };
  }

  const { id } = params as { id: string }
  const article = await prisma.article.findFirst({
    where: {
      id
    }
  })
  if (!article)
    return { redirect: { destination: '/404', permanent: false } };

  return {
    props: {
      article: JSON.parse(JSON.stringify(article))
    },
  }
}

