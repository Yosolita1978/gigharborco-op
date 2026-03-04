import Link from "next/link";

const roleCategories = [
  {
    title: "Officers",
    description:
      "Guide the organization through decision-making and policy development.",
    roles: ["CFO (Chief Financial Officer)", "CMO (Chief Marketing Officer)"],
    accent: "bg-teal/10 border-teal/30",
  },
  {
    title: "Managers",
    description: "Oversee teams and facilitate communication.",
    roles: ["Fundraising Manager", "Marketing Manager", "Technology Manager"],
    accent: "bg-mint/30 border-mint-dark/30",
  },
  {
    title: "Coordinators",
    description:
      "The heartbeat of the co-op — maintaining structure and responding to community needs.",
    roles: [
      "Events Support Coordinator",
      "Grants Coordinator",
      "IT Support",
      "Local Donations Coordinator",
      "Merchandise Coordinator",
      "Partner Support Coordinator",
      "Tool Library Coordinator",
      "Website Development Coordinator",
    ],
    accent: "bg-rose/20 border-rose-dark/30",
  },
  {
    title: "General Volunteers",
    description:
      "Support events and tasks without a formal role. Everyone is welcome to help however they can.",
    roles: [],
    accent: "bg-teal/10 border-teal/30",
  },
];

export default function VolunteerOpportunities() {
  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-mint/20 py-20 md:py-24 px-6 text-center grain">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />
        <h1 className="relative font-serif text-5xl md:text-6xl text-foreground">
          Volunteer Opportunities
        </h1>
      </section>

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-foreground/80 leading-relaxed">
            We are a registered 501(c)(3) community service non-profit
            organization managed and operated 100% by unpaid volunteers. We
            welcome women from all walks of life and skillsets.
          </p>
        </div>
      </section>

      {/* Role Categories */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {roleCategories.map((category) => (
            <div
              key={category.title}
              className={`rounded-2xl border p-6 ${category.accent}`}
            >
              <h2 className="text-xl font-bold text-foreground mb-2">
                {category.title}
              </h2>
              <p className="text-foreground/70 text-sm mb-4">
                {category.description}
              </p>
              {category.roles.length > 0 && (
                <ul className="space-y-1">
                  {category.roles.map((role) => (
                    <li
                      key={role}
                      className="text-foreground/80 text-sm flex items-start gap-2"
                    >
                      <span className="text-teal mt-0.5">&#8226;</span>
                      {role}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mint/20 py-16 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg text-foreground/80 leading-relaxed mb-6">
            If you&apos;re interested in volunteering, we&apos;d love to hear
            from you!
          </p>
          <Link
            href="/contact"
            className="inline-block bg-teal text-white font-medium rounded-full px-8 py-3 hover:bg-teal-dark transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
