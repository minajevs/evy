import type { AppType } from "next/app"
import { SessionProvider } from "next-auth/react";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import NextNProgress from 'nextjs-progressbar'
import PlausibleProvider from 'next-plausible'

import { theme } from '@evy/styling'

import { api } from "~/utils/api"
import { ConfirmProvider } from "~/utils/confirm/ConfirmProvider";
import { env } from "~/env.mjs"
import localFont from "next/font/local";

const bricolageGrotesqueFont = localFont({
  src: '../../public/BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf',
  display: 'swap'
})

const onestFont = localFont({
  src: '../../public/Onest-VariableFont_wght.ttf',
  display: 'swap',
  fallback: ['sans-serif'],
})

const fontTheme = extendTheme(theme, {
  fonts: {
    onest: onestFont.style.fontFamily
  }
})

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <PlausibleProvider domain={env.NEXT_PUBLIC_HOST} customDomain={`https://stats.${env.NEXT_PUBLIC_HOST}`} selfHosted={true}>
      <SessionProvider {...pageProps}>
        <ChakraProvider theme={fontTheme}>
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
