import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — Be Fit Gym Suhareka",
  description: "Refund and cancellation conditions for Be Fit Gym digital memberships.",
};

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Refund Policy
      </h1>
      <p className="mt-2 text-sm text-silver">Effective date: 9 June 2026</p>

      <div className="mt-10 space-y-8 text-silver leading-relaxed">

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">1. Overview</h2>
          <p>
            This Refund Policy applies to all digital membership purchases made on the
            Be Fit Gym website. Please read it carefully before completing your purchase.
            By completing a payment you acknowledge that you have read and accepted this policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">2. Currency</h2>
          <p>
            All transactions are processed in{" "}
            <strong className="text-white">Euros (€)</strong>. Any foreign-currency amount
            shown on your bank or card statement is the result of your card issuer&rsquo;s
            own conversion rate and is not a fee charged by Be Fit Gym.
            Refunds, where applicable, are issued in Euros (€) to the original payment card.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">3. Instant Activation</h2>
          <p>
            Digital memberships are{" "}
            <strong className="text-white">
              activated immediately upon successful card payment clearance
            </strong>
            . Because gym access is granted at the moment of payment, Members should
            carefully review their selected membership plan, duration, and total price
            before confirming the purchase.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">4. Refund Eligibility</h2>
          <p className="mb-4">
            The following table summarises refund eligibility for common scenarios:
          </p>
          <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-left font-semibold text-white">Scenario</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Eligible for Refund</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-4 py-3">Request within 24 hours of purchase and gym not yet visited</td>
                  <td className="px-4 py-3 text-emerald-400 font-medium">Yes — full refund</td>
                </tr>
                <tr className="bg-white/[0.02]">
                  <td className="px-4 py-3">Request after first gym visit (regardless of time elapsed)</td>
                  <td className="px-4 py-3 text-red-400 font-medium">No</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Request more than 24 hours after purchase</td>
                  <td className="px-4 py-3 text-red-400 font-medium">No</td>
                </tr>
                <tr className="bg-white/[0.02]">
                  <td className="px-4 py-3">Duplicate charge due to a verified technical error</td>
                  <td className="px-4 py-3 text-emerald-400 font-medium">Yes — duplicate amount refunded</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Membership partially used or paused</td>
                  <td className="px-4 py-3 text-red-400 font-medium">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">5. How to Request a Refund</h2>
          <p>
            To request a refund where eligible, contact us within 24 hours of your purchase:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-2">
            <li>
              Email{" "}
              <a href="mailto:info@befitgym.com" className="text-cyan-glow hover:underline">
                info@befitgym.com
              </a>{" "}
              with the subject line{" "}
              <span className="text-white">&ldquo;Refund Request — [Order Reference]&rdquo;</span>.
            </li>
            <li>
              Include your full name, the email address used at checkout, and your
              order reference number (found in your confirmation email).
            </li>
          </ul>
          <p className="mt-3">
            Eligible refunds are processed within{" "}
            <strong className="text-white">5–10 business days</strong> back to the original
            payment card. Processing times may vary depending on your card issuer.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">6. Membership Pause as an Alternative</h2>
          <p>
            If you are temporarily unable to attend the gym, we recommend requesting a{" "}
            <strong className="text-white">membership pause</strong> rather than a refund.
            Pauses extend your membership expiry date at no extra cost and preserve the full
            value of your purchase. See{" "}
            <a href="/terms-of-service#pause" className="text-cyan-glow hover:underline">
              Terms of Service §6
            </a>{" "}
            for full pause conditions.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">7. Non-Refundable Situations</h2>
          <p>The following are explicitly not eligible for a refund:</p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Memberships where the Member has visited the gym at least once</li>
            <li>Refund requests made more than 24 hours after purchase</li>
            <li>Memberships that are paused, partially used, or expired</li>
            <li>Change of mind after the 24-hour eligibility window has passed</li>
            <li>Memberships terminated by the Gym due to rule violations</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">8. Chargebacks</h2>
          <p>
            We ask that Members contact us directly before initiating a chargeback with
            their bank or card issuer. Most concerns can be resolved quickly through direct
            communication. Chargebacks filed while a refund request is already being
            processed may result in delays and could affect your future membership eligibility.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">9. Changes to This Policy</h2>
          <p>
            This policy may be updated periodically. The effective date at the top of this
            page reflects the most recent revision. The version in effect at the time of
            your purchase governs your eligibility.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">10. Contact</h2>
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
