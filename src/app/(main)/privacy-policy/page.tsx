import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Be Fit Gym Suhareka",
  description: "How Be Fit Gym collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-silver">Effective date: 9 June 2026</p>

      <div className="mt-10 space-y-8 text-silver leading-relaxed">

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">1. Data Controller</h2>
          <p>
            Be Fit Gym (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is operated by Argjend Sokoli,
            Rr. Lidhja e Prizrenit, Suhareka 23000, Republic of Kosovo.
            For any data-related enquiries please write to{" "}
            <a href="mailto:info@befitgym.com" className="text-cyan-glow hover:underline">
              info@befitgym.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">2. Data We Collect</h2>
          <p>When you purchase a digital membership we collect:</p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Full name and email address</li>
            <li>Telephone number (where provided)</li>
            <li>Payment card details — processed exclusively by our payment partner; we do not store raw card numbers</li>
            <li>Membership type, activation date, and transaction reference</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">3. How We Use Your Data</h2>
          <p>Your data is used to:</p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Activate and manage your gym membership</li>
            <li>Verify your identity on arrival at the facility</li>
            <li>Send payment receipts and membership confirmation emails</li>
            <li>Respond to support, pause, or cancellation requests</li>
            <li>Comply with Kosovo fiscal and EU financial-record obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">4. Legal Basis for Processing</h2>
          <p>
            Processing is necessary for the performance of a contract (your membership agreement)
            and to comply with applicable legal obligations. Where we send marketing
            communications we do so only with your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">5. Data Sharing</h2>
          <p>
            We do not sell your personal data. We share data only with:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            <li>Our payment-processing partner, solely for card authorisation and fraud prevention</li>
            <li>Tax and regulatory authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">6. Data Retention</h2>
          <p>
            Membership and transaction records are retained for seven (7) years to meet fiscal
            and tax obligations. After this period data is securely and permanently deleted.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">7. Your Rights</h2>
          <p>
            Subject to applicable law you may request access to, correction of, or deletion of
            your personal data at any time by contacting us at the address above. Where
            processing is based on consent you may withdraw it at any time without affecting
            the lawfulness of prior processing.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">8. Security</h2>
          <p>
            All data in transit is protected with industry-standard TLS encryption. Access to
            personal data is restricted to authorised personnel only. Payment card data never
            passes through or is stored on our servers.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">9. Changes to This Policy</h2>
          <p>
            We may update this policy periodically. The effective date at the top of this page
            reflects the most recent revision. Continued use of our services after an update
            constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold text-white">10. Contact</h2>
          <p>
            Be Fit Gym &mdash; Rr. Lidhja e Prizrenit, Suhareka 23000, Republic of Kosovo
            <br />
            WhatsApp / phone:{" "}
            <a href="https://wa.me/38348367555" className="text-cyan-glow hover:underline">
              +383 48 367 555
            </a>
          </p>
        </section>

      </div>
    </div>
  );
}
