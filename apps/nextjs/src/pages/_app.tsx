import type { AppType } from "next/app"
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from '@chakra-ui/react'
import NextNProgress from 'nextjs-progressbar'

import { theme } from '@evy/styling'

import { api } from "~/utils/api"
import ConfirmContext from "~/utils/confirm/context"
import { ConfirmProvider } from "~/utils/confirm/ConfirmProvider";

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <SessionProvider {...pageProps}>
      <ChakraProvider theme={theme}>
        <NextNProgress stopDelayMs={100} />
        <ConfirmProvider>
          <Component {...pageProps} />
        </ConfirmProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp)
