import * as React from "react";
import { Html, Head, Main, NextScript } from "next/document";
import {
  DocumentHeadTags,
  documentGetInitialProps,
} from '@mui/material-nextjs/v13-pagesRouter';

export default function MyDocument(props) {
  return (
    <Html lang="en">
      <Head>
        <DocumentHeadTags {...props} />
        {/* PWA primary color */}
        <meta name="theme-color" content="3c7383" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/react-base-table@1.13.2/styles.css"
        />

        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/flexlayout-react@0.6.10/style/light.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/open-sans/index.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/open-sans/500.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/space-grotesk/index.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/space-grotesk/500.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ag-grid-community@29.2.0/styles/ag-grid.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ag-grid-community@29.2.0/styles/ag-theme-alpine.min.css"
        />

        {/* Inject MUI styles first to match with the prepend: true configuration. */}
        {props.emotionStyleTags}
      </Head>
      <body>
        <script
          defer
          src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.1/sigma.min.js"
        ></script>
        <script
          defer
          src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.1/plugins/sigma.layout.forceAtlas2.min.js"
        ></script>
        <script
          defer
          src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.1/plugins/sigma.plugins.dragNodes.min.js"
        ></script>
        <script
          defer
          src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.js"
        ></script>
        <script
          defer
          data-domain="microreact.org" src="https://analytics.cgps.dev/js/plausible.js"
        ></script>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}


MyDocument.getInitialProps = async (ctx) => {
  const finalProps = await documentGetInitialProps(ctx);
  return finalProps;
};
