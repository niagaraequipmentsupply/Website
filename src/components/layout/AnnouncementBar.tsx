import { MapPin, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function AnnouncementBar({ left, right }: { left: string; right: string }) {
  return (
    <div className="bg-navy text-white">
      <Container className="flex h-8 items-center justify-between gap-4 text-[11px] font-medium sm:text-[12px]">
        <p className="flex min-w-0 items-center gap-2"><MapPin className="size-3.5 shrink-0" aria-hidden /><span className="truncate">{left}</span></p>
        <p className="hidden items-center gap-2 md:flex"><Check className="size-3.5" aria-hidden />{right}</p>
      </Container>
    </div>
  );
}
