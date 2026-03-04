"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Website Contact from ${name || "Visitor"}`
    );
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:info@gigharborwc.org?subject=${subject}&body=${body}`;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="bg-mint/30 rounded-2xl p-8 text-center">
        <p className="text-lg text-foreground/80">
          Your email client should have opened with your message. If it
          didn&apos;t, you can email us directly at{" "}
          <a
            href="mailto:info@gigharborwc.org"
            className="text-teal hover:text-teal-dark underline"
          >
            info@gigharborwc.org
          </a>
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-sm text-teal hover:text-teal-dark underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-base font-medium text-foreground mb-1.5">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-base font-medium text-foreground mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-base font-medium text-foreground mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none"
          placeholder="How can we help?"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-teal text-white font-medium rounded-full px-8 py-3 hover:bg-teal-dark transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
