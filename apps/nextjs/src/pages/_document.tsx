import { ColorModeScript } from "@chakra-ui/react"
import Document, { type DocumentContext, Html, Main, NextScript, Head } from "next/document"

import { emotionCache } from "@evy/styling"
import createEmotionServer from "@emotion/server/create-instance"
const { extractCritical } = createEmotionServer(emotionCache)


export default class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = extractCritical(initialProps.html)
    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <style
          key="emotion-css"
          dangerouslySetInnerHTML={{ __html: styles.css }}
          data-emotion-css={styles.ids.join(" ")}
        />,
      ],
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head />

        <body>
          <ColorModeScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
