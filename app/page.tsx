import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-mint/40 via-mint/20 to-offwhite py-24 md:py-36 px-6 grain">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-rose/15 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="animate-fade-up text-sm font-semibold uppercase tracking-[0.2em] text-teal-deep mb-6">
            501(c)(3) Nonprofit &middot; Gig Harbor, WA
          </p>
          <h1 className="animate-fade-up-delay-1 font-serif text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.1] mb-6">
            Empowering Communities{" "}
            <span className="text-teal">for Change</span>
          </h1>
          <p className="animate-fade-up-delay-2 text-lg md:text-xl text-foreground/60 max-w-xl mx-auto mb-10 leading-relaxed">
            Join our mission to create a better world for the women of Gig
            Harbor, Washington and beyond.
          </p>
          <div className="animate-fade-up-delay-3 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.zeffy.com/en-US/donation-form/eb7479b2-d339-4bfb-9695-970dab2e2b2f"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-teal text-white font-semibold rounded-full px-8 py-3.5 text-lg hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/25 transition-all duration-300"
            >
              Donate Now
            </a>
            <Link
              href="/orientation"
              className="inline-block border-2 border-foreground/15 text-foreground font-semibold rounded-full px-8 py-3.5 text-lg hover:border-teal hover:text-teal transition-all duration-300"
            >
              Join the Co-Op
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-foreground/5 bg-warm-gray py-8 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="font-serif text-3xl md:text-4xl text-teal">300+</p>
            <p className="text-sm text-foreground/50 mt-1">Members Onboarded</p>
          </div>
          <div>
            <p className="font-serif text-3xl md:text-4xl text-teal">10,000</p>
            <p className="text-sm text-foreground/50 mt-1">Hours of Service</p>
          </div>
          <div>
            <p className="font-serif text-3xl md:text-4xl text-teal">100%</p>
            <p className="text-sm text-foreground/50 mt-1">Volunteer Run</p>
          </div>
        </div>
      </section>

      {/* Enriching Women */}
      <section className="py-20 md:py-28 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-dark mb-4">
            Our Purpose
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-8 leading-tight">
            Enriching Women
          </h2>
          <p className="text-lg text-foreground/60 leading-relaxed max-w-2xl mx-auto">
            We are a vibrant community that empowers and unites local women
            through the exchange of skills, services, and time. Together, we
            create an environment where every member can thrive, contribute, and
            feel valued.
          </p>
        </div>
      </section>

      {/* Video */}
      <section className="relative overflow-hidden bg-foreground py-20 md:py-28 px-6">
        <div className="absolute inset-0 bg-linear-to-br from-teal-deep/20 via-foreground to-foreground" />
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal mb-4">
              See Our Community
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-offwhite leading-tight">
              Meet the Co-Op
            </h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
            <div className="aspect-video">
              <iframe
                src="https://www.youtube-nocookie.com/embed/91hVXEcrqhs?rel=0&modestbranding=1"
                title="Gig Harbor Women's Co-Op Introduction"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Time Bank */}
      <section className="relative overflow-hidden py-20 md:py-28 px-6 grain">
        {/* Asymmetric background */}
        <div className="absolute inset-0 bg-linear-to-br from-mint/25 via-offwhite to-rose/15" />

        <div className="relative mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — visual */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 md:w-72 md:h-72 rounded-full bg-teal/15 flex items-center justify-center">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-teal/20 flex items-center justify-center">
                  <div className="text-center px-4">
                    <p className="font-serif text-5xl md:text-6xl text-teal-deep">
                      1:1
                    </p>
                    <p className="text-sm text-foreground/50 mt-2">
                      Every hour valued equally
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-rose/30" />
              <div className="absolute -bottom-2 -left-6 w-14 h-14 rounded-full bg-mint-dark/40" />
            </div>
          </div>

          {/* Right — text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-deep mb-4">
              How It Works
            </p>
            <h2 className="font-serif text-4xl text-foreground mb-6 leading-tight">
              The Co-Op Time Bank
            </h2>
            <p className="text-foreground/60 leading-relaxed mb-4">
              Time banking is a currency based on time that people can exchange
              with each other. It&apos;s a bartering system where people trade
              services for credits based on labor time, instead of money.
            </p>
            <p className="text-foreground/60 leading-relaxed mb-8">
              Participation is easy and free. Join our community to get started.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.facebook.com/GigHarborWC/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground/15 rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:border-teal hover:text-teal transition-all duration-300"
              >
                Facebook
                <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 11L11 1M11 1H4M11 1v7" />
                </svg>
              </a>
              <a
                href="https://band.us/n/a1a5b7zdP9rdP"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-foreground/15 rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:border-teal hover:text-teal transition-all duration-300"
              >
                BAND
                <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 11L11 1M11 1H4M11 1v7" />
                </svg>
              </a>
              <Link
                href="/orientation"
                className="inline-flex items-center gap-2 bg-teal text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-teal-dark transition-all duration-300"
              >
                Learn How to Join
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4 leading-tight">
            Ready to make a difference?
          </h2>
          <p className="text-foreground/60 text-lg mb-8">
            Whether you want to volunteer your time, request help, or simply
            connect with other women in our community — we&apos;d love to
            welcome you.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-foreground text-offwhite font-semibold rounded-full px-8 py-3.5 text-lg hover:bg-foreground/80 transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
