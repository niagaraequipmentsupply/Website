import Link from "next/link";
import Image from "next/image";

/**
 * Official logo. Light variant (navy text) on white surfaces, dark variant (white text) on navy.
 * Files: /public/brand/logo-light.png, logo-dark.png, icon.png (square N mark).
 */
export function Logo({ light = false, compact = false, className = "" }: { light?: boolean; compact?: boolean; className?: string }) {
  const src = light ? "/brand/logo-dark.png" : "/brand/logo-light.png";
  return (
    <Link href="/" className={`flex shrink-0 items-center ${className}`} aria-label="Niagara Equipment Supply home">
      <Image src={src} alt="Niagara Equipment Supply" width={1738} height={438} sizes="(max-width: 640px) 160px, 200px" priority className={`w-auto ${compact ? "h-8 sm:h-9" : "h-9 sm:h-11"}`} />
    </Link>
  );
}

/** Square N mark for tight spots (benefit cards, badges). */
export function LogoMark({ className = "size-10" }: { className?: string }) {
  return <Image src="/brand/icon.png" alt="" width={256} height={256} className={className} aria-hidden />;
}
