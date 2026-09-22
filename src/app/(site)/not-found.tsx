import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="section text-center">
      <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-navy">404</p>
      <h1 className="display mt-2 text-charcoal">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-grey">The page you&apos;re looking for has moved or doesn&apos;t exist.</p>
      <div className="mt-6 flex justify-center gap-3"><Button href="/" arrow>Back to Home</Button><Button href="/inventory" variant="secondary">Browse Inventory</Button></div>
    </Container>
  );
}
