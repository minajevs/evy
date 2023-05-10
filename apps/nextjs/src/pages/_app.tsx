import type { AppType } from "next/app"
import { ClerkProvider } from '@clerk/nextjs'
import { ChakraProvider } from '@chakra-ui/react'

import { theme } from '@evy/styling'

import { api } from "~/utils/api"

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <ClerkProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp)
