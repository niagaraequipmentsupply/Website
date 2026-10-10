import Script from "next/script";

/**
 * A GoHighLevel booking calendar in the page. `src` is the calendar's embed URL (Calendars → the calendar → Share →
 * Embed code → the iframe src). The helper script sizes the frame to the calendar's own height.
 */
export function CalendarEmbed({ src, title, className = "" }: { src: string; title: string; className?: string }) {
  const host = process.env.NEXT_PUBLIC_GHL_WIDGET_HOST || "link.msgsndr.com";
  return (
    <div className={`overflow-hidden rounded-card border border-line bg-white ${className}`}>
      <iframe src={src} title={title} className="min-h-[640px] w-full border-0" loading="lazy" scrolling="no" style={{ overflow: "hidden" }} />
      <Script src={`https://${host}/js/form_embed.js`} strategy="lazyOnload" />
    </div>
  );
}
