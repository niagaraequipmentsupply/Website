import Script from "next/script";

/**
 * Site analytics, loaded after the page is idle so they stay off the critical path.
 *  - Google Analytics 4: NEXT_PUBLIC_GA_ID (G-XXXXXXX).
 *  - GoHighLevel visitor tracking (links visits and form submissions to the CRM contact): NEXT_PUBLIC_GHL_TRACKING_ID (tk_…).
 * Both honour the consent notice: a visitor who declined (localStorage nes-consent = "declined") gets neither.
 */
const GHL_TRACKING_SRC = "https://links.builtreach.com/js/external-tracking.js";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const ghlId = process.env.NEXT_PUBLIC_GHL_TRACKING_ID;
  if (!gaId && !ghlId) return null;
  return (
    <>
      {gaId && <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />}
      {gaId && (
        <Script id="ga4-init" strategy="lazyOnload">{`try{if(localStorage.getItem('nes-consent')==='declined'){window['ga-disable-${gaId}']=true;}}catch(e){}
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { send_page_view: true });`}</Script>
      )}
      {ghlId && (
        <Script id="ghl-tracking" strategy="lazyOnload">{`try{if(localStorage.getItem('nes-consent')!=='declined'){var s=document.createElement('script');s.src='${GHL_TRACKING_SRC}';s.async=true;s.setAttribute('data-tracking-id','${ghlId}');document.body.appendChild(s);}}catch(e){}`}</Script>
      )}
    </>
  );
}
