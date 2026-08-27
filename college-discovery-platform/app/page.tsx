import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <Container className="py-20 flex flex-col items-center justify-center min-h-[calc(100vh-140px)]">
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Discover Your Ideal <span className="text-primary">College</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          Compare institutions, explore placement data, and find colleges that match your goals.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="/colleges" className="w-full sm:w-auto">
            <Button size="lg" className="w-full">Browse Colleges</Button>
          </Link>
          <Link href="/predictor" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">Try Predictor</Button>
          </Link>
        </div>
      </section>
    </Container>
  );
}
