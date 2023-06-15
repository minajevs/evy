import type { AppType } from "next/app"
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from '@chakra-ui/react'

import { theme } from '@evy/styling'

import { api } from "~/utils/api"

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <SessionProvider {...pageProps}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp)
