import Script from "next/script";

/**
 * GoHighLevel web chat. Set NEXT_PUBLIC_GHL_CHAT_WIDGET_ID (Sites → Chat Widget → the data-widget-id in the embed code);
 * NEXT_PUBLIC_GHL_WIDGET_HOST overrides the loader host for a white-labelled account. Nothing renders until the id is set.
 */
export function ChatWidget() {
  const id = process.env.NEXT_PUBLIC_GHL_CHAT_WIDGET_ID;
  if (!id) return null;
  const host = process.env.NEXT_PUBLIC_GHL_WIDGET_HOST || "widgets.leadconnectorhq.com";
  return <Script src={`https://${host}/loader.js`} strategy="lazyOnload" data-resources-url={`https://${host}/chat-widget/loader.js`} data-widget-id={id} />;
}
