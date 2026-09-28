"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, Phone, X, ClipboardList, ChevronDown, ChevronRight, MapPin, Clock, ArrowRight } from "lucide-react";
import type { NavGroup, NavItem } from "@/lib/types";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { EquipmentImage } from "@/components/ui/EquipmentImage";
import { Logo } from "./Logo";
import { useQuote, quoteCount } from "@/store/quote";
import { StoreHydration } from "@/store/StoreHydration";
import { track } from "@/lib/analytics";

export interface HeaderContact {
  phone: string;
  phoneHref: string;
  address: string;
  hours: { day: string; time: string }[];
  mapEmbedUrl?: string;
}

interface Props { nav: NavGroup[]; contact: HeaderContact }

export function Header({ nav, contact }: Props) {
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const items = useQuote((s) => s.items);
  const count = quoteCount(items);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (lastPath !== pathname) { setLastPath(pathname); setOpen(false); }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address || "Niagara Equipment Supply")}`;

  return (
    <header className={`sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur transition-[height,box-shadow] duration-200 ${scrolled ? "shadow-card" : ""}`}>
      <StoreHydration />
      <Container className={`flex items-center justify-between gap-4 transition-[height] duration-200 ${scrolled ? "h-16" : "h-[76px]"}`}>
        <Logo compact={scrolled} />
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-4 xl:gap-6">
            {nav.map((n) => (
              <li key={n.href}>
                {n.children?.length ? (
                  <MegaMenu group={n} active={isActive(n.href)} />
                ) : (
                  <Link href={n.href} className={navLinkClass(isActive(n.href))}>{n.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/quote" aria-label={`Quote list, ${count} items`} className="relative flex size-11 items-center justify-center rounded-btn text-navy hover:bg-tint">
            <ClipboardList className="size-6" aria-hidden />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-electric px-1 text-[11px] font-bold text-white">{count}</span>}
          </Link>
          <div className="hidden md:block">
            <Button href={contact.phoneHref} size="sm" icon={<Phone className="size-4" aria-hidden />} onClick={() => track({ name: "phone_click", location: "header" })}>
              {contact.phone}
            </Button>
          </div>
          <div className="hidden sm:block">
            <MapHours contact={contact} directions={directions} />
          </div>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="flex size-11 items-center justify-center rounded-btn text-navy hover:bg-tint lg:hidden">
            <Menu className="size-6" aria-hidden />
          </button>
        </div>
      </Container>

      {open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)} className="absolute inset-0 bg-charcoal/50" />
          <div className="slide-in absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-white shadow-lift">
            <div className="flex h-[76px] items-center justify-between border-b border-line px-5">
              <Logo compact />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex size-11 items-center justify-center rounded-btn text-navy hover:bg-tint"><X className="size-6" aria-hidden /></button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-3">
              <ul>
                {nav.map((n) => (
                  <li key={n.href}>
                    {n.children?.length ? (
                      <MobileGroup group={n} active={isActive(n.href)} onNavigate={() => setOpen(false)} />
                    ) : (
                      <Link href={n.href} onClick={() => setOpen(false)} className={`block rounded-btn px-3 py-3 text-base font-semibold ${isActive(n.href) ? "bg-tint text-navy" : "text-charcoal hover:bg-light"}`}>{n.label}</Link>
                    )}
                  </li>
                ))}
                <li><Link href="/quote" onClick={() => setOpen(false)} className="block rounded-btn px-3 py-3 text-base font-semibold text-charcoal hover:bg-light">Quote List {count > 0 && `(${count})`}</Link></li>
              </ul>
            </nav>
            <div className="grid gap-2 border-t border-line p-4">
              <Button href={contact.phoneHref} icon={<Phone className="size-4" aria-hidden />}>Call {contact.phone}</Button>
              <Button href="/contact#hours" variant="secondary" icon={<MapPin className="size-4" aria-hidden />}>Map &amp; Hours</Button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  );
}

const navLinkClass = (active: boolean) =>
  `relative whitespace-nowrap py-2 text-[15px] font-medium transition-colors hover:text-electric ${active ? "text-navy after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:bg-navy" : "text-charcoal"}`;

/** Shared open/close behaviour for header popovers: hover intent, Escape, outside click, focus-out. */
function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(undefined);
  const byClick = useRef(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { byClick.current = false; setOpen(false); } };
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { byClick.current = false; setOpen(false); } };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [open]);
  const show = () => { window.clearTimeout(timer.current); setOpen(true); };
  const hide = () => { timer.current = window.setTimeout(() => { if (!byClick.current) setOpen(false); }, 140); };
  const onBlur = (e: React.FocusEvent) => { if (!ref.current?.contains(e.relatedTarget as Node)) { byClick.current = false; setOpen(false); } };
  /** Click opens (hover may already have opened it); a second deliberate click closes. Never let a click cancel a hover-open. */
  const toggle = () => { window.clearTimeout(timer.current); if (open && byClick.current) { byClick.current = false; setOpen(false); } else { byClick.current = true; setOpen(true); } };
  const close = () => { byClick.current = false; setOpen(false); };
  return { open, setOpen: close, ref, show, hide, onBlur, toggle };
}

/** Desktop mega menu: items with photos; items that have children reveal a second level on click/hover. */
function MegaMenu({ group, active }: { group: NavGroup; active: boolean }) {
  const { open, setOpen, ref, show, hide, onBlur, toggle } = usePopover();
  const items = group.children ?? [];
  const nested = items.some((i) => i.children?.length);
  const [activeIdx, setActiveIdx] = useState(0);
  const current = items[activeIdx] ?? items[0];

  return (
    <div ref={ref} onMouseEnter={show} onMouseLeave={hide} onBlur={onBlur}>
      <div className="flex items-center">
        <Link href={group.href} className={navLinkClass(active)}>{group.label}</Link>
        <button type="button" aria-haspopup="true" aria-expanded={open} aria-label={`${group.label} menu`} onClick={toggle} className="ml-0.5 flex size-8 items-center justify-center rounded text-grey hover:text-electric">
          <ChevronDown className={`size-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </div>
      {open && (
        <div className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 ${nested ? "w-[720px]" : "w-[640px]"}`}>
          <div className="rounded-card border border-line bg-white p-3 shadow-lift">
            {nested ? (
              <div className="grid grid-cols-[300px_1fr] gap-3">
                <ul className="space-y-1 border-r border-line pr-3">
                  {items.map((item, i) => (
                    <li key={item.href}>
                      <MenuTile item={item} active={i === activeIdx} onActivate={() => setActiveIdx(i)} onNavigate={() => setOpen()} showChevron />
                    </li>
                  ))}
                </ul>
                <div className="pl-1">
                  {current && (
                    <>
                      <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-grey">{current.label}</p>
                      <ul className="grid grid-cols-2 gap-x-2">
                        {current.children?.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} onClick={setOpen} className="block rounded-btn px-3 py-2 text-[14px] font-semibold text-charcoal hover:bg-tint hover:text-navy">{c.label}</Link>
                          </li>
                        ))}
                        {!current.children?.length && <li className="px-3 py-2 text-sm text-grey">Attachments coming soon.</li>}
                      </ul>
                      <Link href={current.href} onClick={setOpen} className="mt-2 inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-navy hover:text-electric">
                        All {current.label.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <ul className="grid grid-cols-2 gap-1">
                {items.map((item) => (
                  <li key={item.href}><MenuTile item={item} onNavigate={() => setOpen()} /></li>
                ))}
              </ul>
            )}
            <div className="mt-2 border-t border-line pt-2">
              <Link href={group.href} onClick={setOpen} className="inline-flex items-center gap-1 rounded-btn px-3 py-2 text-[13px] font-semibold uppercase tracking-wide text-navy hover:bg-tint">
                View all {group.label.toLowerCase()} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuTile({ item, active, onActivate, onNavigate, showChevron }: { item: NavItem; active?: boolean; onActivate?: () => void; onNavigate: () => void; showChevron?: boolean }) {
  const inner = (
    <>
      <EquipmentImage image={item.image} kind={item.artKind ?? "generic"} alt={item.label} className="w-16 shrink-0 bg-light" ratio="aspect-[4/3]" sizes="64px" compact />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-bold text-charcoal">{item.label}</span>
        {item.description && <span className="block truncate text-[12px] text-grey">{item.description}</span>}
      </span>
      {showChevron && <ChevronRight className={`size-4 shrink-0 ${active ? "text-navy" : "text-grey"}`} aria-hidden />}
    </>
  );
  const cls = `flex w-full items-center gap-3 rounded-btn p-2 text-left transition-colors ${active ? "bg-tint" : "hover:bg-tint"}`;
  if (onActivate) {
    return (
      <div className="flex items-center">
        <button type="button" onClick={onActivate} onMouseEnter={onActivate} onFocus={onActivate} aria-expanded={active} className={cls}>{inner}</button>
      </div>
    );
  }
  return <Link href={item.href} onClick={onNavigate} className={cls}>{inner}</Link>;
}

/** "Map & Hours" popover: store hours, address, directions and contact link. */
function MapHours({ contact, directions }: { contact: HeaderContact; directions: string }) {
  const { open, setOpen, ref, show, hide, onBlur, toggle } = usePopover();
  return (
    <div ref={ref} className="relative" onMouseEnter={show} onMouseLeave={hide} onBlur={onBlur}>
      <Button variant="secondary" size="sm" icon={<MapPin className="size-4" aria-hidden />} onClick={toggle} aria-haspopup="true" aria-expanded={open}>
        Map &amp; Hours
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 w-80 pt-3">
          <div className="rounded-card border border-line bg-white p-4 shadow-lift">
            <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-grey"><Clock className="size-4 text-navy" aria-hidden />Store hours</p>
            <ul className="mt-2 divide-y divide-line text-sm">
              {contact.hours.map((h) => (
                <li key={h.day} className="flex justify-between py-1.5"><span className="font-semibold text-charcoal">{h.day}</span><span className="text-grey">{h.time}</span></li>
              ))}
            </ul>
            {contact.address && <p className="mt-3 flex items-start gap-2 text-sm text-grey"><MapPin className="mt-0.5 size-4 shrink-0 text-navy" aria-hidden />{contact.address}</p>}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button href={directions} size="sm" target="_blank" rel="noopener">Get Directions</Button>
              <Button href="/contact" size="sm" variant="secondary" onClick={setOpen}>Contact Us</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile: group → categories (with photo) → attachment types. */
function MobileGroup({ group, active, onNavigate }: { group: NavGroup; active: boolean; onNavigate: () => void }) {
  const [open, setOpen] = useState(active);
  const [openChild, setOpenChild] = useState<string | null>(null);
  return (
    <div>
      <div className="flex items-center">
        <Link href={group.href} onClick={onNavigate} className={`flex-1 rounded-btn px-3 py-3 text-base font-semibold ${active ? "bg-tint text-navy" : "text-charcoal hover:bg-light"}`}>{group.label}</Link>
        <button type="button" aria-expanded={open} aria-label={`${open ? "Collapse" : "Expand"} ${group.label}`} onClick={() => setOpen((o) => !o)} className="flex size-11 items-center justify-center rounded-btn text-navy hover:bg-light">
          <ChevronDown className={`size-5 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </div>
      {open && (
        <ul className="mb-1 ml-3 border-l-2 border-line pl-2">
          {group.children!.map((c) => {
            const hasKids = !!c.children?.length;
            const kidsOpen = openChild === c.href;
            return (
              <li key={c.href}>
                <div className="flex items-center">
                  <Link href={c.href} onClick={onNavigate} className="flex flex-1 items-center gap-3 rounded-btn px-2 py-2 text-[15px] font-medium text-charcoal hover:bg-light">
                    <EquipmentImage image={c.image} kind={c.artKind ?? "generic"} alt={c.label} className="w-12 shrink-0 bg-light" ratio="aspect-[4/3]" sizes="48px" compact />
                    {c.label}
                  </Link>
                  {hasKids && (
                    <button type="button" aria-expanded={kidsOpen} aria-label={`${kidsOpen ? "Collapse" : "Expand"} ${c.label}`} onClick={() => setOpenChild(kidsOpen ? null : c.href)} className="flex size-11 items-center justify-center rounded-btn text-navy hover:bg-light">
                      <ChevronDown className={`size-5 transition-transform ${kidsOpen ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                  )}
                </div>
                {hasKids && kidsOpen && (
                  <ul className="mb-1 ml-4 border-l-2 border-line pl-2">
                    {c.children!.map((k) => <li key={k.href}><Link href={k.href} onClick={onNavigate} className="block rounded-btn px-3 py-2 text-[14px] font-medium text-charcoal hover:bg-light">{k.label}</Link></li>)}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
