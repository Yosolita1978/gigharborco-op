import Image from "next/image";

const newsletters = [
  {
    edition: 9,
    date: "June 16, 2025",
    filename: "GHWC Newsletter - Edition 9 - 06.16.2025.pdf",
  },
  {
    edition: 8,
    date: "May 19, 2025",
    filename: "GHWC Newsletter - Edition 8 - 05.19.2025.pdf",
  },
  {
    edition: 7,
    date: "April 16, 2025",
    filename: "GHWC Newsletter - Edition 7 - 04.16.2025.pdf",
  },
  {
    edition: 6,
    date: "March 16, 2025",
    filename: "GHWC Newsletter - Edition 6 - 03.16.2025.pdf",
  },
  {
    edition: 5,
    date: "February 24, 2025",
    filename: "GHWC Newsletter - Edition 5 - 02.24.2025.pdf",
  },
  {
    edition: 4,
    date: "February 8, 2025",
    filename: "GHWC Newsletter - Edition 4 - 02.08.2025.pdf",
  },
  {
    edition: 3,
    date: "January 24, 2025",
    filename: "GHWC Newsletter - Edition 3 - 01.24.2025.pdf",
  },
  {
    edition: 2,
    date: "January 10, 2025",
    filename: "GHWC Newsletter - Edition 2 - 01.10.2025.pdf",
  },
  {
    edition: 1,
    date: "December 20, 2024",
    filename: "GHWC Newsletter - Edition 1 - 12.20.2024.pdf",
  },
];

const DRIVE_FOLDER =
  "https://drive.google.com/drive/folders/1b5uFU6Ya8VWpUdmtOM8BE3TsTRK52DKc";

export default function Newsletters() {
  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-mint/20 py-20 md:py-24 px-6 text-center grain">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />
        <div className="relative">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground">
            Newsletters
          </h1>
          <p className="text-foreground/60 mt-4 max-w-lg mx-auto text-lg">
            Stay up to date with everything happening in our community.
          </p>
        </div>
      </section>

      {/* Newsletter Grid */}
      <section className="py-16 md:py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsletters.map((nl) => (
              <a
                key={nl.edition}
                href={DRIVE_FOLDER}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden border border-foreground/5 bg-warm-gray/50 hover:border-teal/30 hover:shadow-lg hover:shadow-teal/10 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-3/4 overflow-hidden bg-mint/10">
                  <Image
                    src={`/images/newsletters/GHWC-newsletter-edition${nl.edition}.png`}
                    alt={`GHWC Newsletter Edition ${nl.edition}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-teal transition-colors">
                      Edition {nl.edition}
                    </p>
                    <p className="text-sm text-foreground/50">{nl.date}</p>
                  </div>
                  <svg
                    className="w-4 h-4 text-foreground/30 group-hover:text-teal group-hover:translate-x-0.5 transition-all duration-300 shrink-0"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M1 11L11 1M11 1H4M11 1v7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-foreground/50 text-sm">
              All newsletters are available as PDFs in our{" "}
              <a
                href={DRIVE_FOLDER}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal hover:text-teal-dark underline"
              >
                Google Drive folder
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
