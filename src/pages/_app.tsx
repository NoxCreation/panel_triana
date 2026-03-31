import VoyPatiTheme from "@/components/theme/Theme";
import "@/styles/globals.css";
import "@/styles/Home.module.css";
import '@/styles/nprogress.css';
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Router } from "next/router";
import NProgress from 'nprogress';
import { useEffect } from "react";
import { appWithTranslation } from 'next-i18next';
import { nextI18NextConfig } from '../../next-i18next.config.js'
import VoypatiProviderProvider from "@/providers/VoypatiProvider";

NProgress.configure({ showSpinner: false });

const handleRouteChangeStart = () => {
  NProgress.start();
};

const handleRouteChangeComplete = () => {
  NProgress.done();
};

const handleRouteChangeError = () => {
  NProgress.done();
};

function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, []);

  return (
    <ChakraProvider theme={VoyPatiTheme}>
      <SessionProvider>
        <VoypatiProviderProvider>
          <Component {...pageProps} />
        </VoypatiProviderProvider>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default appWithTranslation(App, nextI18NextConfig);