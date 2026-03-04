import Image from "next/image";

export default function AboutUs() {
  return (
    <>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-mint/20 py-20 md:py-24 px-6 text-center grain">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-rose/15 blur-3xl" />
        <h1 className="relative font-serif text-5xl md:text-6xl text-foreground">About Us</h1>
      </section>

      {/* Mission */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-3xl">
          <div className="bg-mint/20 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-teal mb-4">
              Our Mission
            </h2>
            <p className="font-serif text-xl md:text-2xl text-foreground leading-relaxed">
              &ldquo;To empower and unite communities of women through the
              exchange of skills, services, and time.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Staff & Volunteers */}
      <section className="pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl text-foreground mb-4">
            Our Staff &amp; Volunteers
          </h2>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Our organization operates entirely through the volunteer efforts of
            our amazing co-op members. If you&apos;re interested in joining our
            leadership mission, connect with us through our{" "}
            <a
              href="https://www.facebook.com/GigHarborWC/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:text-teal-dark underline"
            >
              Facebook Group
            </a>
            ,{" "}
            <a
              href="https://band.us/n/a1a5b7zdP9rdP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:text-teal-dark underline"
            >
              BAND
            </a>
            , or email us at{" "}
            <a
              href="mailto:info@gigharborwc.org"
              className="text-teal hover:text-teal-dark underline"
            >
              info@gigharborwc.org
            </a>
            .
          </p>
        </div>
      </section>

      {/* Founder Letter */}
      <section className="bg-offwhite py-16 px-6">
        <div className="mx-auto max-w-3xl">
          {/* Founder intro */}
          <div className="flex items-center gap-5 mb-8">
            <div className="relative shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-teal/20 ring-offset-2 ring-offset-offwhite">
                <Image
                  src="/images/Jillian -photo.png"
                  alt="Jillian O'Block"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-mint border-2 border-offwhite" />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-foreground leading-tight">
                Open Letter From Our Founder
              </h2>
              <p className="text-sm text-foreground/50 mt-1">August 15, 2024</p>
            </div>
          </div>

          <div className="border-l-4 border-teal pl-6 md:pl-8 space-y-6 text-foreground/80 leading-relaxed">
            <p>Dearest Community Members;</p>

            <p>
              I am deeply moved by the many stories I&apos;ve heard from so many
              of you about the positive impact our incredible co-op is having on
              both our community and your personal lives. While the benefits to
              our mental health and well-being may be difficult to quantify,
              there are several tangible areas where the co-op is striving to
              make a meaningful difference. I would like to take this opportunity
              to explain these in more detail.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              Unseen Labor: The Hidden Value of Caregivers
            </h3>

            <p>
              In our society, so much of the work that truly holds our
              communities together goes unrecognized, particularly the labor
              performed by women and caregivers. According to a report by Oxfam,
              women worldwide perform 75% of unpaid care work, a contribution
              worth an estimated $10.8 trillion annually. This labor includes
              everything from raising children to caring for elderly family
              members, to managing households &mdash; all essential tasks that
              are often taken for granted and undervalued.
            </p>

            <p>
              It&apos;s absurd that we don&apos;t recognize the immense value of
              these people, the very ones who nurture, support, and sustain our
              families and communities. Our Co-op is committed to changing that
              narrative. Here, we aim to reclaim those unaccounted hours,
              breaking down barriers and giving caregivers their time back
              because their work deserves to be seen, valued, and compensated.
            </p>

            <p>
              After reading Melinda Gates&apos;{" "}
              <em>Moment of Lift</em>, I felt an even stronger commitment to
              remove the barriers that keep the invaluable work of caregivers
              hidden and unaccounted for.
            </p>

            <p>
              In her book, Melinda Gates writes: &ldquo;Unpaid work is the
              hidden engine that keeps the wheels of our economies, communities,
              and families moving. It is work that is essential, yet often
              invisible and unrecognized. If we truly want to lift up our
              society, we must start by recognizing and valuing the unpaid labor
              that so many women perform every day.&rdquo;
            </p>

            <p>
              This passage struck a chord with me because it highlights the very
              heart of our mission at the Gig Harbor Women&apos;s Co-op &mdash;
              bringing visibility, recognition, and value to the work that is
              too often overlooked. We are here to reclaim those unaccounted
              hours and ensure that every contribution is seen and valued.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              Our Pursuit: Reclaiming Time and Fostering Equality
            </h3>

            <p>
              In our Co-op, we are dedicated to reclaiming the unaccounted hours
              that so many women and caregivers give to their families and
              communities. By doing this, we are breaking down barriers and
              giving them time back that is rightfully theirs.
            </p>

            <p>
              Our currency is time, and in our co-op, every hour is valued
              equally on a 1:1 basis. This equality of time removes the room for
              oppressive valuing of work that often creates divides between
              people. Instead, it fosters genuine human connections, allowing us
              to interact as equals, without the hierarchies of advantage and
              disadvantage that are so prevalent in other areas of society.
            </p>

            <p>
              When we see each other as equals, we open the door to deeper
              connections and a better understanding of the needs of our
              collective community. This understanding is essential to creating a
              more sustainable society, one where everyone&apos;s contributions
              are recognized, valued, and respected. Our efforts to remove
              barriers on people&apos;s time ensure that we can connect in ways
              that are not only more meaningful but also more impactful for the
              greater good.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              Child-Friendly Support: Empowering Caregivers
            </h3>

            <p>
              At our Co-op, we understand the challenges that come with
              balancing caregiving responsibilities and community involvement.
              That&apos;s why we&apos;ve made it a priority to offer
              child-friendly tasks and support for those who want to volunteer
              but need help with childcare.
            </p>

            <p>
              When volunteering within the co-op, childcare <em>can</em> be
              provided through our hours bank, free of charge to the caregiver.
              This means that while you contribute your time and skills to the
              co-op, your childcare needs can be covered, but it will need to be
              coordinated. The hours for childcare come from our general co-op
              hours bank, a resource we reserve for specific purposes like
              community service and child-friendly tasks.
            </p>

            <p>
              This system ensures that we all have the opportunity to participate
              and contribute without the added stress of finding or affording
              childcare. Caregivers still receive their hours for the time they
              volunteer, allowing them to be compensated while their children are
              cared for in a safe and supportive environment.
            </p>

            <h3 className="text-xl font-semibold text-foreground pt-4">
              Mental Health and Community: Breaking the Isolation
            </h3>

            <p>
              In today&apos;s fast-paced world, many of us find ourselves
              isolated, holed up in our homes, trying to accomplish the
              impossible task of &ldquo;getting on top of things&rdquo; alone.
              The more we strive to do it all alone, the more we feel
              overwhelmed and disconnected. This isolation isn&apos;t just
              exhausting, it&apos;s detrimental to our mental health.
            </p>

            <p>
              At our Co-op, we believe in the power of community to break this
              cycle of isolation. By coming together and supporting one another,
              we not only share the workload but also create meaningful
              connections that lift us up. Even for those of us who are
              introverts at heart and need plenty of solitude, there&apos;s
              immense value in working alongside others who understand and share
              our struggles.
            </p>

            <p>
              Being part of a community where everyone&apos;s time is valued
              equally allows us to connect on a deeper level. It opens the door
              to truly listening and understanding the needs of those around us,
              which in turn helps us build a more sustainable and supportive
              society for everyone. When we work together, we find that the
              impossible tasks become possible, and the weight of the world is a
              little easier to bear.
            </p>

            <p>
              So, let&apos;s break the isolation. Let&apos;s come together as a
              community, support each other, and reclaim not just our time but
              our well-being. The Gig Harbor Women&apos;s Co-op is here to help
              you connect, share, and thrive.
            </p>

            <p>
              Thank you so much for reading and for being a part of this amazing
              community of women.
            </p>

            <div className="pt-6">
              <p className="italic mb-4">Peace and Love,</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-teal/15 shrink-0">
                  <Image
                    src="/images/Jillian -photo.png"
                    alt="Jillian O'Block"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Jillian O&apos;Block
                  </p>
                  <p className="text-sm text-foreground/60">Director | Founder</p>
                  <a
                    href="mailto:Jillian@gigharborwc.org"
                    className="text-sm text-teal hover:text-teal-dark"
                  >
                    Jillian@gigharborwc.org
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
