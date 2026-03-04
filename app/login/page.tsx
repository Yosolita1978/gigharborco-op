import Link from "next/link";

export default function Login() {
  return (
    <section className="py-20 px-6">
      <div className="mx-auto max-w-md text-center">
        <div className="bg-mint/20 rounded-2xl p-8 md:p-12">
          <h1 className="font-serif text-3xl text-foreground mb-4">Member Login</h1>
          <p className="text-foreground/70 mb-8">
            Our member portal is coming soon. You&apos;ll be able to log in and
            view your Time Bank balance and transaction history.
          </p>
          <Link
            href="/"
            className="inline-block bg-teal text-white font-medium rounded-full px-8 py-3 hover:bg-teal-dark transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
