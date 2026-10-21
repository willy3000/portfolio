import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

const TITLE = 'Willy Wario — Full-Stack Developer';
const DESCRIPTION =
  'Kenyan software engineer working in Kigali, Rwanda, with 5+ years shipping production web applications with React, Next.js, TypeScript, Node.js and REST APIs.';
const IMAGE = 'https://willy-j-wario-portfolio.netlify.app/images/banner.png';

// Runs before first paint and picks the presentation. "on" stages the content
// as a scroll-driven 3D journey; "off" is the same content as a calm, static
// page. A stored choice wins, then the reduced-motion preference. Without
// JavaScript the attribute is never set and the static layout is used.
const motionScript = `(function(){var r=document.documentElement;var m=null;try{m=localStorage.getItem('motion')}catch(e){}if(m!=='on'&&m!=='off'){m=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on'}if(!window.WebGLRenderingContext)m='off';r.dataset.motion=m})();`;

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en-GB">
        <Head>
          <script dangerouslySetInnerHTML={{ __html: motionScript }} />
          <link rel="icon" href="/favicon.ico" sizes="48x48" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:opsz,wght@14..32,300..700&family=JetBrains+Mono:wght@400;500&display=swap"
            rel="stylesheet"
          />
          <meta name="theme-color" content="#05070b" />
          <meta name="description" content={DESCRIPTION} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={TITLE} />
          <meta property="og:description" content={DESCRIPTION} />
          <meta property="og:image" content={IMAGE} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={TITLE} />
          <meta name="twitter:description" content={DESCRIPTION} />
          <meta name="twitter:image" content={IMAGE} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
