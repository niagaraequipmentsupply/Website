import Script from "next/script";

/** Google Analytics 4 (gtag.js), loaded after the page is idle so it stays off the critical path. Set NEXT_PUBLIC_GA_ID (G-XXXXXXX); nothing loads when it is unset. */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="lazyOnload" />
      <Script id="ga4-init" strategy="lazyOnload">{`try{if(localStorage.getItem('nes-consent')==='declined'){window['ga-disable-${id}']=true;}}catch(e){}
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { send_page_view: true });`}</Script>
    </>
  );
}
