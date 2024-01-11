import type { AppType } from "next/app"
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from '@chakra-ui/react'
import NextNProgress from 'nextjs-progressbar'
import PlausibleProvider from 'next-plausible'

import { theme } from '@evy/styling'

import { api } from "~/utils/api"
import { ConfirmProvider } from "~/utils/confirm/ConfirmProvider";
import { env } from "~/env.mjs"

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <PlausibleProvider domain={env.NEXT_PUBLIC_HOST} customDomain={`https://stats.${env.NEXT_PUBLIC_HOST}/js/script.js`} selfHosted={true}>
      <SessionProvider {...pageProps}>
        <ChakraProvider theme={theme}>
          <NextNProgress stopDelayMs={100} />
          <ConfirmProvider>
            <Component {...pageProps} />
          </ConfirmProvider>
        </ChakraProvider>
      </SessionProvider>
    </PlausibleProvider>
  );
};

export default api.withTRPC(MyApp)
