import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Be Fit Gym Suhareka",
  description: "Membership terms, activation rules, and cancellation conditions for Be Fit Gym.",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-silver">Effective date: 9 June 2026</p>

      <div className="mt-10 space-y-8 text-silver leading-relaxed">

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">1. Parties</h2>
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern the relationship between
            Be Fit Gym, operated by Argjend Sokoli, Rr. Lidhja e Prizrenit, Suhareka 23000,
            Republic of Kosovo (&ldquo;Gym&rdquo;) and any person (&ldquo;Member&rdquo;)
            who purchases a gym membership through our website or at the facility.
            By completing a purchase you agree to these Terms in full.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">2. Membership Activation</h2>
          <p>
            Digital memberships purchased through the Be Fit Gym website are{" "}
            <strong className="text-white">activated instantly upon successful card payment clearance</strong>.
            A confirmation email is sent to the address provided at checkout. Physical access
            to the gym facility becomes available immediately on the activation date. No separate
            check-in or registration step is required at the gym on the first visit.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">3. Pricing and Currency</h2>
          <p>
            All membership fees are denominated and charged in{" "}
            <strong className="text-white">Euros (€)</strong>. The price displayed at checkout
            is the total and final price inclusive of any applicable taxes. No additional
            recurring fees apply unless the Member purchases a renewal or upgrade.
            Any currency conversion fees displayed on your bank or card statement are
            applied by your card issuer and are outside our control.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">4. Membership Duration</h2>
          <p>
            Memberships are valid for the period specified at the time of purchase (e.g.,
            1 month, 3 months, 12 months). The membership period begins on the activation
            date and expires at midnight (23:59 CET) on the final day of the period.
            Memberships do not renew automatically.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">5. Non-Transferability</h2>
          <p>
            Memberships are <strong className="text-white">personal and non-transferable</strong>.
            A membership may not be sold, gifted, shared, or otherwise assigned to any other
            individual. Gym access is granted exclusively to the registered Member whose
            details appear on the membership. Violation of this clause may result in
            immediate membership termination without refund.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">6. Membership Pause</h2>
          <p>
            A Member may request to pause an active membership under the following conditions:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2">
            <li>
              A written pause request must be submitted at least{" "}
              <strong className="text-white">three (3) calendar days</strong> before the desired
              pause start date.
            </li>
            <li>
              A pause may be invoked{" "}
              <strong className="text-white">once per 12-month membership period</strong>.
            </li>
            <li>
              The standard maximum pause duration is{" "}
              <strong className="text-white">30 consecutive calendar days</strong>.
            </li>
            <li>
              The membership expiry date is extended by the exact number of days the membership
              is paused, at no additional charge.
            </li>
            <li>
              Pauses requested for verified medical reasons (supported by a doctor&rsquo;s
              certificate) may exceed 30 days at management&rsquo;s discretion.
            </li>
          </ul>
          <p className="mt-3">
            Pause requests must be sent to{" "}
            <a href="mailto:info@befitgym.com" className="text-cyan-glow hover:underline">
              info@befitgym.com
            </a>{" "}
            or by phone at{" "}
            <a href="tel:+38348367555" className="text-cyan-glow hover:underline">
              +383 48 367 555
            </a>{" "}
            with the subject or opening line &ldquo;Membership Pause Request&rdquo;.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">7. Gym Rules and Conduct</h2>
          <p>
            All Members must adhere to the gym&rsquo;s posted rules at all times, including
            but not limited to: appropriate sports attire, cleaning equipment after use,
            respectful conduct towards staff and other Members, and compliance with safety
            instructions. The Gym reserves the right to suspend or permanently terminate a
            membership, without refund, for repeated or serious violations of these rules.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">8. Health and Liability</h2>
          <p>
            Members participate in physical exercise at their own risk. Members represent
            that they are in adequate physical health to engage in gym activities and accept
            full responsibility for any injury arising from misuse of equipment or failure to
            follow safety instructions. The Gym is not liable for personal injury, loss, or
            damage to personal property except where caused by our gross negligence.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">9. Amendments</h2>
          <p>
            These Terms may be updated at any time. The updated Terms will be published on
            this page with a revised effective date. Continued use of your membership after
            an update constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">10. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the
            Republic of Kosovo. Any disputes that cannot be resolved informally shall be
            referred to the competent court in Suhareka.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">11. Contact</h2>
          <p>
            Be Fit Gym &mdash; Rr. Lidhja e Prizrenit, Suhareka 23000, Republic of Kosovo
            <br />
            Phone:{" "}
            <a href="tel:+38348367555" className="text-cyan-glow hover:underline">
              +383 48 367 555
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
