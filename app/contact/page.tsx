import ContactForm from "@/src/components/ui/ContactForm";

const emailContacts = [
  { label: "General Inquiries", email: "info@gigharborwc.org" },
  { label: "Onboarding", email: "onboarding@gigharborwc.org" },
  { label: "Time Bank", email: "timebank@gigharborwc.org" },
  { label: "Tasks", email: "tasks@gigharborwc.org" },
];

export default function Contact() {
  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-mint/20 py-20 md:py-24 px-6 text-center grain">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />
        <h1 className="relative font-serif text-5xl md:text-6xl text-foreground">
          Contact Us
        </h1>
        <p className="relative mt-4 text-lg text-foreground/50">
          We&apos;d love to hear from you
        </p>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Drop Us a Line
            </h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">
              Get in Touch
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Location</h3>
                <p className="text-foreground/70">
                  Gig Harbor, Washington, United States
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <ul className="space-y-1">
                  {emailContacts.map((contact) => (
                    <li key={contact.email}>
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-3 py-2 px-3 -mx-3 rounded-lg text-foreground hover:bg-mint/15 transition-colors"
                      >
                        <span className="text-sm text-foreground/50 shrink-0">
                          {contact.label}
                        </span>
                        <span className="text-teal">
                          {contact.email}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Community
                </h3>
                <p className="text-foreground/70 mb-3">
                  Join us on our community platforms:
                </p>
                <div className="flex flex-col gap-1">
                  <a
                    href="https://www.facebook.com/GigHarborWC/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 -mx-3 rounded-lg text-teal hover:bg-mint/15 transition-colors"
                  >
                    Facebook Group
                  </a>
                  <a
                    href="https://band.us/n/a1a5b7zdP9rdP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 -mx-3 rounded-lg text-teal hover:bg-mint/15 transition-colors"
                  >
                    BAND Community
                  </a>
                  <a
                    href="https://www.instagram.com/gigharborwc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 -mx-3 rounded-lg text-teal hover:bg-mint/15 transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Nonprofit Status
                </h3>
                <p className="text-foreground/70 text-sm">
                  Gig Harbor Women&apos;s Mutual Association
                </p>
                <p className="text-foreground/70 text-sm">
                  DBA: Gig Harbor Women&apos;s Co-Op
                </p>
                <p className="text-foreground/70 text-sm">
                  501(c)(3) &middot; EIN: 99-2854438
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  Newsletter
                </h3>
                <p className="text-foreground/70">
                  Sign up to hear from us about co-op activities, events, and
                  workshops. Email{" "}
                  <a
                    href="mailto:info@gigharborwc.org?subject=Newsletter%20Signup"
                    className="text-teal hover:text-teal-dark underline"
                  >
                    info@gigharborwc.org
                  </a>{" "}
                  to subscribe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
