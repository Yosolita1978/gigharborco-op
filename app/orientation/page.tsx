import Link from "next/link";

const upcomingOrientations = [
  {
    date: "Mon, Mar 2",
    time: "11:00 AM",
    location: "Nichols Community Center",
    address: "690 9th Ave, Fox Island, WA 98333",
  },
  {
    date: "Sun, Mar 8",
    time: "2:00 PM",
    location: "Kitsap Regional Library, Port Orchard",
    address: "87 Sidney Ave, Port Orchard, WA 98366",
  },
  {
    date: "Sat, Mar 21",
    time: "10:00 AM",
    location: "Cutters Point Coffee",
    address: "5500 Olympic Dr A101, Gig Harbor, WA 98335",
  },
];

export default function Orientation() {
  const steps = [
    {
      number: 1,
      title: "Attend Orientation",
      description:
        "Join a one-hour orientation meeting. Sessions can be found on our Google Calendar.",
      link: { href: "/events", label: "View Calendar" },
    },
    {
      number: 2,
      title: "Complete Application",
      description:
        "Fill out an application form where you consent to a public background check.",
      link: {
        href: "https://docs.google.com/forms/d/e/1FAIpQLSfg9hit9qSQEw4rAsuW_YlTpiLTr14hs4UerQDknXQqda_ngw/viewform",
        label: "Open Application Form",
        external: true,
      },
    },
    {
      number: 3,
      title: "Review Policies",
      description:
        "Review our organizational policies and procedures using the Co-op Public Files.",
      link: {
        href: "https://drive.google.com/drive/u/1/folders/1o-Z2sgPsMofTj6FAYQElMhhzdpSk91R6",
        label: "View Public Files",
        external: true,
      },
    },
    {
      number: 4,
      title: "Receive Welcome Email",
      description:
        "Within one week of completing both the orientation and the application, you will receive your welcome email. If you don't receive it, contact us at onboarding@gigharborwc.org.",
    },
    {
      number: 5,
      title: "Get Involved",
      description:
        "Start attending events and volunteering on tasks. Welcome to the community!",
    },
  ];

  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-mint/20 py-20 md:py-24 px-6 text-center grain">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />
        <h1 className="relative font-serif text-5xl md:text-6xl text-foreground">
          Orientation
        </h1>
      </section>

      {/* Key Requirement */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="bg-teal/10 border border-teal/30 rounded-2xl p-6 md:p-8">
            <p className="text-lg text-foreground/80 leading-relaxed">
              In order to participate in Time Bank tasks and private events,
              members must first complete the onboarding process to become fully
              vetted Co-op Participants.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Orientations */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-dark mb-4">
            Join the Co-Op Community
          </p>
          <h2 className="font-serif text-3xl text-foreground mb-6">
            Upcoming Orientations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingOrientations.map((o) => (
              <div
                key={`${o.date}-${o.time}`}
                className="flex items-start gap-4 p-4 rounded-xl border border-foreground/5 bg-warm-gray/50"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-teal/15 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-teal-deep"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{o.date}</p>
                  <p className="text-sm text-foreground/60">
                    {o.time} &middot; {o.location}
                  </p>
                  <p className="text-xs text-foreground/50 mt-0.5">
                    {o.address}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-foreground mb-8">
            Five-Step Onboarding Process
          </h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 mt-1">{step.description}</p>
                  {"link" in step && step.link && (
                    "external" in step.link && step.link.external ? (
                      <a
                        href={step.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-sm font-medium text-teal hover:text-teal-dark underline"
                      >
                        {step.link.label} &rarr;
                      </a>
                    ) : (
                      <Link
                        href={step.link.href}
                        className="inline-block mt-2 text-sm font-medium text-teal hover:text-teal-dark underline"
                      >
                        {step.link.label} &rarr;
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost */}
      <section className="bg-mint/20 py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl text-foreground mb-4">
            Free to Join
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            The orientation is completely free. Our co-op covers onboarding
            expenses. Donations toward background check costs are welcomed but
            entirely optional.
          </p>
          <a
            href="https://www.zeffy.com/en-US/donation-form/eb7479b2-d339-4bfb-9695-970dab2e2b2f"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-teal text-white font-medium rounded-full px-8 py-3 hover:bg-teal-dark transition-colors"
          >
            Donate to Support Onboarding
          </a>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-foreground/80">
            Questions about orientation? Email us at{" "}
            <a
              href="mailto:onboarding@gigharborwc.org"
              className="text-teal hover:text-teal-dark underline"
            >
              onboarding@gigharborwc.org
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
