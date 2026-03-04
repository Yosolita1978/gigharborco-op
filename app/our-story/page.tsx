export default function OurStory() {
  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-mint/20 py-20 md:py-24 px-6 text-center grain">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />
        <h1 className="relative font-serif text-5xl md:text-6xl text-foreground">Our Story</h1>
      </section>

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            The Gig Harbor Women&apos;s Co-op emerged from founder Jillian
            O&apos;Block&apos;s vision to establish &ldquo;a space where we
            could come together, support each other, and contribute to the
            well-being of our community through collaborative efforts.&rdquo;
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            O&apos;Block created the co-op while managing significant personal
            challenges: raising four neurodivergent children, living with
            limited income, and navigating her own neurodivergence. Recognizing
            similar struggles among other community women &mdash; isolation,
            stress, and social anxiety &mdash; she developed an innovative
            mutual aid model. Rather than focusing on specialized skills, the
            concept emphasized everyday assistance: cleaning, cooking, laundry,
            and yard work.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-mint/10 py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-foreground mb-10">Our Journey</h2>
          <ul className="border-l-2 border-teal ml-4 space-y-10">
            <li className="relative pl-8">
              <span className="absolute -left-2.5 top-1 h-5 w-5 rounded-full bg-teal" />
              <h3 className="font-semibold text-lg text-foreground">
                Late September 2023
              </h3>
              <p className="text-foreground/70 mt-1">
                Launched as the Gig Harbor Cleaning Co-op, initially targeting
                mothers in Peninsula School District.
              </p>
            </li>
            <li className="relative pl-8">
              <span className="absolute -left-2.5 top-1 h-5 w-5 rounded-full bg-teal" />
              <h3 className="font-semibold text-lg text-foreground">
                Growing Our Community
              </h3>
              <p className="text-foreground/70 mt-1">
                Empty nesters requested inclusion, prompting expansion to
                welcome all women, including transgender and non-binary
                individuals.
              </p>
            </li>
            <li className="relative pl-8">
              <span className="absolute -left-2.5 top-1 h-5 w-5 rounded-full bg-teal" />
              <h3 className="font-semibold text-lg text-foreground">
                May 2024
              </h3>
              <p className="text-foreground/70 mt-1">
                Achieved 501(c)(3) nonprofit status, solidifying our commitment
                to the community.
              </p>
            </li>
            <li className="relative pl-8">
              <span className="absolute -left-2.5 top-1 h-5 w-5 rounded-full bg-rose/50" />
              <h3 className="font-semibold text-lg text-foreground">Today</h3>
              <p className="text-foreground/70 mt-1">
                Over 300 onboarded members and nearly 10,000 hours of community
                service tracked. Zero budget for ongoing costs &mdash; powered
                entirely by our members.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-foreground mb-4">
            Community Impact
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            Members report transformative experiences. Long-time residents who
            had lived in isolation for years &mdash; some for 10 to 20 years
            &mdash; developed meaningful relationships and strong support
            networks through the co-op.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Jillian&apos;s journey demonstrates that &ldquo;anyone, regardless
            of their background, can do truly meaningful things.&rdquo;
          </p>
        </div>
      </section>

      {/* Future */}
      <section className="bg-mint/20 py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-foreground mb-4">
            Looking Forward
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Our priorities include securing funding, growing our platform, and
            sharing our model with other communities. We believe we&apos;re
            initiating a real movement with the potential to transform how
            communities support each other through connection and mutual aid.
          </p>
        </div>
      </section>
    </>
  );
}
