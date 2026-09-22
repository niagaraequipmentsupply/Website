import { Instagram, Facebook, Youtube } from "@/components/layout/SocialIcons";
import type { SiteContent } from "@/lib/catalogue";

const Tiktok = (p: React.SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.2a7.3 7.3 0 0 0 4.3 1.4V7.5a4.3 4.3 0 0 1-3.2-1.7z" /></svg>;

/** Follow-us strip: links to the dealership's channels. Handles come from Site Settings. */
export function SocialStrip({ site, compact }: { site: SiteContent["site"]; compact?: boolean }) {
  const channels = [
    { label: "YouTube", handle: site.social.youtubeHandle ?? "Service videos & walkarounds", href: site.social.youtube, Icon: Youtube, text: "Step-by-step repairs, first-service walkthroughs and machine walkarounds." },
    { label: "Instagram", handle: site.social.instagramHandle ?? "Daily shop & field updates", href: site.social.instagram, Icon: Instagram, text: "Field calls, deliveries and what's on the lift this week." },
    { label: "Facebook", handle: site.social.facebookHandle ?? "Owner community", href: site.social.facebook, Icon: Facebook, text: "Owner questions, event dates and stock updates." },
    ...(site.social.tiktok ? [{ label: "TikTok", handle: site.social.tiktokHandle ?? "Quick tips", href: site.social.tiktok, Icon: Tiktok, text: "60-second fixes and tips." }] : []),
  ].filter((c) => c.href && c.href !== "#");
  if (channels.length === 0) return null;
  return (
    <ul className={`grid gap-3 ${compact ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {channels.map((c) => (
        <li key={c.label}>
          <a href={c.href} target="_blank" rel="noopener" className="flex h-full items-start gap-3 rounded-card border border-line bg-white p-4 transition-colors hover:border-electric hover:bg-tint">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-navy text-white"><c.Icon className="size-5" /></span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-grey">{c.label}</span>
              <span className="block truncate font-bold text-charcoal">{c.handle}</span>
              {!compact && <span className="mt-1 block text-[13px] text-grey">{c.text}</span>}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
