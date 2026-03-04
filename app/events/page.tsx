export default function Events() {
  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-mint/20 py-20 md:py-24 px-6 text-center grain">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />
        <div className="relative">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">
            Events
          </h1>
          <p className="text-foreground/60 mt-4 max-w-lg mx-auto text-lg">
            See what&apos;s coming up in our community.
          </p>
        </div>
      </section>

      {/* Calendars */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Calendar 1 */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6 text-center">
              Community Calendar
            </h2>
            <div className="rounded-2xl overflow-hidden border border-foreground/5 shadow-sm">
              <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=c_16301dbe509c7f1696e8c5f8aa684eaa291e645f7995cdc944c60090cdbb33b9%40group.calendar.google.com&ctz=America%2FLos_Angeles"
                  title="GHWC Community Calendar"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Calendar 2 */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-6 text-center">
              Events Calendar
            </h2>
            <div className="rounded-2xl overflow-hidden border border-foreground/5 shadow-sm">
              <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=c_ea32705130d3786346e9b4c357e66dde49aead2731d53ad6eb0832e774420050%40group.calendar.google.com&ctz=America%2FLos_Angeles"
                  title="GHWC Events Calendar"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0 }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
