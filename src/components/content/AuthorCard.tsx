import Image from "next/image";
import Link from "next/link";
import type { Author } from "@/lib/types";

const initials = (name: string) => name.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

/** Author / team-member card: photo (or initials), name, role, bio, credentials and links. Used under blog posts and on the About page. */
export function AuthorCard({ author, eyebrow, showTeamLink, className = "" }: { author: Author; eyebrow?: string; showTeamLink?: boolean; className?: string }) {
  return (
    <div className={`flex gap-5 rounded-card border border-line bg-white p-5 ${className}`}>
      {author.photo ? (
        <Image src={author.photo.src} alt={author.photo.alt} width={88} height={88} className="size-[72px] shrink-0 rounded-full object-cover sm:size-[88px]" />
      ) : (
        <span aria-hidden className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-tint text-xl font-bold text-navy sm:size-[88px] sm:text-2xl">{initials(author.name)}</span>
      )}
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy">{eyebrow}</p>}
        <p className="mt-1 text-lg font-bold text-charcoal">{author.name}{author.role && <span className="font-medium text-grey"> · {author.role}</span>}</p>
        <p className="mt-2 text-sm leading-relaxed text-grey">{author.bio}</p>
        {author.credentials.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Credentials">
            {author.credentials.map((c) => <li key={c} className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-semibold text-charcoal">{c}</li>)}
          </ul>
        )}
        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-navy">
          {showTeamLink && <Link href="/about#team" className="hover:text-electric">Meet the team</Link>}
          {author.email && <a href={`mailto:${author.email}`} className="hover:text-electric">Email {author.name.split(" ")[0]}</a>}
          {author.linkedin && <a href={author.linkedin} rel="noopener" target="_blank" className="hover:text-electric">LinkedIn</a>}
          {author.website && <a href={author.website} rel="noopener" target="_blank" className="hover:text-electric">{author.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>}
        </p>
      </div>
    </div>
  );
}

/** schema.org Person for an author. */
export const personSchema = (a: Author, siteUrl: string) => ({
  "@type": "Person",
  name: a.name,
  ...(a.role ? { jobTitle: a.role } : {}),
  description: a.bio,
  url: `${siteUrl}/about#team`,
  ...(a.photo ? { image: a.photo.src.startsWith("http") ? a.photo.src : `${siteUrl}${a.photo.src}` } : {}),
  ...(a.linkedin || a.website ? { sameAs: [a.linkedin, a.website].filter(Boolean) } : {}),
});
