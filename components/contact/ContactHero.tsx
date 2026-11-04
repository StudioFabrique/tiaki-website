
import { Container } from "@/components/layout/Container";

type ContactHeroProps = {
  title: string;
  description: string;
};

export function ContactHero({
  title,
  description,
}: ContactHeroProps) {
  return (
    <section
      aria-labelledby="contact-page-title"
      className="pt-12 pb-14 sm:pt-16 sm:pb-20"
    >
      <Container>
        {/* <div className="mx-auto max-w-5xl text-center"> */}
            <div className="w-full text-center">
          <h1
            id="contact-page-title"
            className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>
      </Container>
    </section>
  );
}
