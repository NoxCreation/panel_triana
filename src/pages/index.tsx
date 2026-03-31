import LoadSuspense from "@/components/LoadSuspense";
import { GetServerSideProps } from "next";
import is_auth from "@/utils/middlewares/is_auth";
import { prisma } from "@/utils/prisma";
import { Stack } from "@chakra-ui/react";
import Head from "next/head";

export default function Splash() {

  const ceo_title = "Triana Marketing Panel"
  const ceo_description = "Panel de gestión de contenido web+aplicación"
  const ceo_image = `https://${process.env.NEXT_PUBLIC_DOMAIN}/social.webp`
  const ceo_url = `https://${process.env.NEXT_PUBLIC_DOMAIN}`
  const ceo_locale = 'es'

  return (
    <Stack>
      <Head>
        <title>{ceo_title}</title>
        <meta name="description" content={ceo_description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="author" content="NOX Creation" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="all" />
        <meta http-equiv="Content-Language" content="en"></meta>

        <meta property="og:title" content={ceo_title} />
        <meta property="og:description" content={ceo_description} />
        <meta property="og:image" content={ceo_image} />
        <meta property="og:url" content={ceo_url} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={ceo_locale} />
        <meta property="og:site_name" content={ceo_title} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={ceo_title} />
        <meta name="twitter:description" content={ceo_description} />
        <meta name="twitter:image" content={ceo_image} />
        <meta name="twitter:url" content={ceo_url} />

        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon16.ico" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon32.ico" sizes="32x32" />
        <link rel="icon" type="image/png" href="/favicon48.ico" sizes="48x48" />

        <meta name="msapplication-TileColor" content={"#F7FAFC"} />
        <meta name="theme-color" content={"#F7FAFC"} />
      </Head>
      <main>
        <LoadSuspense load={() => import('@/modules/Auth')} />
      </main>
    </Stack>
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
