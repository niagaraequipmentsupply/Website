import Script from "next/script";

/**
 * Site analytics, loaded on the visitor's first interaction (scroll, tap, key) or after a few idle seconds, whichever
 * comes first, so neither script competes with the page's own content on a phone connection.
 *  - Google Analytics 4: NEXT_PUBLIC_GA_ID (G-XXXXXXX).
 *  - GoHighLevel visitor tracking (links visits and form submissions to the CRM contact): NEXT_PUBLIC_GHL_TRACKING_ID (tk_…).
 * Both honour the consent notice: a visitor who declined (localStorage nes-consent = "declined") gets neither.
 */
const GHL_TRACKING_SRC = "https://links.builtreach.com/js/external-tracking.js";

export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const ghlId = process.env.NEXT_PUBLIC_GHL_TRACKING_ID;
  if (!gaId && !ghlId) return null;
  const loader = `(function(){var done=false;function load(){if(done)return;done=true;try{var declined=localStorage.getItem('nes-consent')==='declined';
${gaId ? `if(declined){window['ga-disable-${gaId}']=true;}window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${gaId}',{send_page_view:true});var g=document.createElement('script');g.src='https://www.googletagmanager.com/gtag/js?id=${gaId}';g.async=true;document.head.appendChild(g);` : ""}
${ghlId ? `if(!declined){var s=document.createElement('script');s.src='${GHL_TRACKING_SRC}';s.async=true;s.setAttribute('data-tracking-id','${ghlId}');document.body.appendChild(s);}` : ""}
}catch(e){}}
['pointerdown','keydown','touchstart','scroll'].forEach(function(e){addEventListener(e,load,{once:true,passive:true});});
setTimeout(load,4000);})();`;
  return <Script id="analytics-loader" strategy="afterInteractive">{loader}</Script>;
}
