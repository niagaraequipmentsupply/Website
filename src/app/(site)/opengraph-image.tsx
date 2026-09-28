import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import { site } from "@/data/site";

export const alt = "Niagara Equipment Supply, official RIPPA dealer in Thorold, Ontario";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image for every site page (product and blog pages override with their own photo). */
export default async function Image() {
  const logo = await fs.readFile(path.join(process.cwd(), "public/brand/logo-dark.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  const footer = `RIPPA Service Centre · Genuine parts shipped across Canada · ${site.url.replace(/^https?:\/\//, "")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg, #0B2A5C 0%, #083D91 100%)", color: "white", fontFamily: "Helvetica, Arial, sans-serif" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={420} height={420 * 0.31} style={{ objectFit: "contain", objectPosition: "left" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", opacity: 0.8 }}>Official RIPPA Dealer · Thorold, Ontario</div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, marginTop: 16 }}>Mini excavators, skid steers, loaders & attachments</div>
          <div style={{ fontSize: 30, marginTop: 22, opacity: 0.9 }}>{footer}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
