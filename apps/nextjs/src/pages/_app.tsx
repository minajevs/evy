import type { AppType } from "next/app"
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from '@chakra-ui/react'
import NextNProgress from 'nextjs-progressbar'

import { theme } from '@evy/styling'

import { api } from "~/utils/api"

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <SessionProvider {...pageProps}>
      <ChakraProvider theme={theme}>
        <NextNProgress stopDelayMs={100} />
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp)
