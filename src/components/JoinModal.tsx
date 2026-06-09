"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  Banknote,
  Check,
  CheckCircle2,
  CreditCard,
  Loader2,
  MessageCircle,
  QrCode,
  Wallet,
  Wifi,
  X,
} from "lucide-react";
import { useJoinModal } from "./JoinModalProvider";
import { useLanguage } from "./LanguageProvider";
import type { Translations } from "@/lib/translations";

const TIERS = ["Basic", "Premium", "VIP"] as const;

// Mirrors the hardcoded package records on the server (see vpos-initiate route)
// so the request body carries a price the API can verify.
const TIER_PACKAGES: Record<(typeof TIERS)[number], { id: string; price: number }> = {
  Basic: { id: "basic", price: 29 },
  Premium: { id: "premium", price: 49 },
  VIP: { id: "vip", price: 79 },
};

const PAYMENT_METHOD_IDS = ["card", "transfer", "cash"] as const;
const PAYMENT_METHOD_ICONS = { card: CreditCard, transfer: Wallet, cash: Banknote };

type PaymentMethodId = (typeof PAYMENT_METHOD_IDS)[number];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  tier: string;
  paymentMethod: PaymentMethodId | "";
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  tier: TIERS[0],
  paymentMethod: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s-]{6,}$/;
const CARD_NUMBER_PATTERN = /^[\d\s]{12,19}$/;
const CARD_EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/\d{2}$/;
const CARD_CVC_PATTERN = /^\d{3,4}$/;

export default function JoinModal() {
  const { isOpen, selectedTier, sessionId, closeJoinModal } = useJoinModal();

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Keying by `sessionId` mounts a brand-new form (with a clean slate and the
  // freshly chosen tier pre-selected) every time the modal is opened.
  return <JoinModalContent key={sessionId} initialTier={selectedTier} onClose={closeJoinModal} />;
}

function JoinModalContent({
  initialTier,
  onClose,
}: {
  initialTier: string | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM, tier: initialTier ?? INITIAL_FORM.tier });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirectingToBank, setIsRedirectingToBank] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [membershipCode, setMembershipCode] = useState("");

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = () => {
    const next: FormErrors = {};
    if (!form.fullName.trim()) next.fullName = t.joinModal.errors.fullName;
    if (!EMAIL_PATTERN.test(form.email)) next.email = t.joinModal.errors.email;
    if (!PHONE_PATTERN.test(form.phone)) next.phone = t.joinModal.errors.phone;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next: FormErrors = {};
    if (!form.paymentMethod) next.paymentMethod = t.joinModal.errors.paymentMethod;
    if (form.paymentMethod === "card") {
      if (!CARD_NUMBER_PATTERN.test(form.cardNumber)) next.cardNumber = t.joinModal.errors.cardNumber;
      if (!CARD_EXPIRY_PATTERN.test(form.cardExpiry)) next.cardExpiry = t.joinModal.errors.cardExpiry;
      if (!CARD_CVC_PATTERN.test(form.cardCvc)) next.cardCvc = t.joinModal.errors.cardCvc;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validateStep2()) return;

    if (form.paymentMethod === "card") {
      await redirectToBankTerminal();
      return;
    }

    setIsSubmitting(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    setMembershipCode(generateMembershipCode(form.tier));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const redirectToBankTerminal = async () => {
    setIsRedirectingToBank(true);

    try {
      const selectedPackage = TIER_PACKAGES[form.tier as keyof typeof TIER_PACKAGES];

      const response = await fetch("/api/checkout/vpos-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          packageId: selectedPackage.id,
          price: selectedPackage.price,
        }),
      });

      if (!response.ok) throw new Error("Failed to initiate VPOS payment");

      const { gatewayUrl, formFields } = (await response.json()) as {
        gatewayUrl: string;
        formFields: Record<string, string>;
      };

      const bankForm = document.createElement("form");
      bankForm.method = "POST";
      bankForm.action = gatewayUrl;
      bankForm.style.display = "none";

      for (const [name, value] of Object.entries(formFields)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        bankForm.appendChild(input);
      }

      document.body.appendChild(bankForm);
      bankForm.submit();
    } catch {
      setIsRedirectingToBank(false);
      setErrors((prev) => ({
        ...prev,
        paymentMethod: t.joinModal.errors.bankTerminal,
      }));
    }
  };

  const handleClose = () => {
    if (isSubmitting || isRedirectingToBank) return;
    onClose();
  };

  return (
    <>
      {isRedirectingToBank && <BankRedirectOverlay />}

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-modal-title"
        onClick={handleClose}
      >
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-midnight shadow-[0_0_64px_-12px_var(--color-cyan-glow)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label={t.joinModal.closeAria}
          onClick={handleClose}
          disabled={isSubmitting || isRedirectingToBank}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-silver transition-colors duration-300 hover:border-cyan-glow hover:text-cyan-glow disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="overflow-y-auto px-6 pb-8 pt-8 sm:px-8">
          {isSuccess ? (
            <SuccessState tier={form.tier} membershipCode={membershipCode} onClose={handleClose} t={t} />
          ) : isSubmitting ? (
            <SubmittingState label={t.joinModal.submitting} />
          ) : (
            <>
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow">
                  {t.joinModal.membershipBadge(form.tier)}
                </span>
                <h2
                  id="join-modal-title"
                  className="mt-4 text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl"
                >
                  {t.joinModal.titleStart}
                  <span className="text-gradient-electric">{t.joinModal.titleHighlight}</span>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-silver">{t.joinModal.subtitle}</p>
              </div>

              <ProgressBar currentStep={step} steps={t.joinModal.steps} />

              <form
                className="mt-8 flex flex-col gap-6"
                onSubmit={step === 2 ? handleSubmit : (event) => event.preventDefault()}
              >
                {step === 1 ? (
                  <PersonalInfoStep form={form} errors={errors} onChange={updateField} t={t} />
                ) : (
                  <PaymentStep form={form} errors={errors} onChange={updateField} t={t} />
                )}

                <div className="flex items-center justify-between gap-4 pt-2">
                  {step === 2 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-foreground transition-colors duration-300 hover:border-cyan-glow hover:text-cyan-glow"
                    >
                      {t.joinModal.buttons.back}
                    </button>
                  ) : (
                    <span aria-hidden="true" />
                  )}

                  {step === 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-electric px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105"
                    >
                      {t.joinModal.buttons.continue}
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isRedirectingToBank}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-electric px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {form.paymentMethod === "card"
                        ? t.joinModal.buttons.proceedToPayment
                        : t.joinModal.buttons.confirmPayment}
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

function ProgressBar({
  currentStep,
  steps,
}: {
  currentStep: 1 | 2;
  steps: Translations["joinModal"]["steps"];
}) {
  const STEPS = [
    { id: 1, label: steps.personalInfo },
    { id: 2, label: steps.paymentMethod },
  ] as const;

  return (
    <div className="mt-8 flex items-center">
      {STEPS.map((stepItem, index) => {
        const isComplete = currentStep > stepItem.id;
        const isActive = currentStep === stepItem.id;
        return (
          <div key={stepItem.id} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-300 ${
                  isComplete
                    ? "border-cyan-glow bg-gradient-electric text-obsidian"
                    : isActive
                      ? "border-cyan-glow text-cyan-glow"
                      : "border-white/15 text-silver"
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" strokeWidth={2.5} /> : stepItem.id}
              </div>
              <span
                className={`text-[11px] font-semibold uppercase tracking-wide ${
                  isActive || isComplete ? "text-foreground" : "text-silver"
                }`}
              >
                {stepItem.label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <div className="mx-3 mb-5 h-px flex-1 bg-white/10">
                <div
                  className={`h-px bg-gradient-electric transition-all duration-500 ease-out ${
                    isComplete ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

type StepProps = {
  form: FormState;
  errors: FormErrors;
  onChange: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  t: Translations;
};

function filterFullNameInput(rawValue: string) {
  return rawValue.replace(/[^\p{L}\s'-]/gu, "");
}

function filterPhoneInput(rawValue: string) {
  return rawValue.replace(/[^\d+\s-]/g, "");
}

function PersonalInfoStep({ form, errors, onChange, t }: StepProps) {
  const f = t.joinModal.fields;
  return (
    <div className="flex flex-col gap-5">
      <Field label={f.fullName} error={errors.fullName}>
        <input
          type="text"
          value={form.fullName}
          onChange={(event) => onChange("fullName", filterFullNameInput(event.target.value))}
          placeholder={f.fullNamePlaceholder}
          className={inputClass(Boolean(errors.fullName))}
        />
      </Field>

      <Field label={f.email} error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder={f.emailPlaceholder}
          className={inputClass(Boolean(errors.email))}
        />
      </Field>

      <Field label={f.phone} error={errors.phone}>
        <input
          type="tel"
          inputMode="tel"
          value={form.phone}
          onChange={(event) => onChange("phone", filterPhoneInput(event.target.value))}
          placeholder={f.phonePlaceholder}
          className={inputClass(Boolean(errors.phone))}
        />
      </Field>

      <Field label={f.membershipPlan}>
        <div className="grid grid-cols-3 gap-3">
          {TIERS.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => onChange("tier", tier)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
                form.tier === tier
                  ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow"
                  : "border-white/10 bg-white/5 text-silver hover:border-white/20 hover:text-foreground"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </Field>
    </div>
  );
}

function PaymentStep({ form, errors, onChange, t }: StepProps) {
  const j = t.joinModal;
  const PAYMENT_METHODS = PAYMENT_METHOD_IDS.map((id) => ({
    id,
    icon: PAYMENT_METHOD_ICONS[id],
    ...j.paymentMethods[id],
  }));

  return (
    <div className="flex flex-col gap-5">
      <Field label={j.fields.paymentMethod} error={errors.paymentMethod}>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            const isActive = form.paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onChange("paymentMethod", method.id)}
                aria-pressed={isActive}
                className={`flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
                  isActive
                    ? "border-transparent bg-gradient-electric text-obsidian shadow-[0_0_28px_-6px_var(--color-cyan-glow)]"
                    : "border-white/10 bg-white/5 text-silver hover:border-white/20 hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                <span className="text-xs font-semibold uppercase tracking-wide">{method.label}</span>
              </button>
            );
          })}
        </div>
      </Field>

      {form.paymentMethod === "card" && <CardPaymentPanel form={form} errors={errors} onChange={onChange} t={t} />}

      {form.paymentMethod === "transfer" && (
        <InfoPanel icon={Wallet} title={j.infoPanels.transfer.title} description={j.infoPanels.transfer.description} />
      )}

      {form.paymentMethod === "cash" && (
        <InfoPanel icon={Banknote} title={j.infoPanels.cash.title} description={j.infoPanels.cash.description} />
      )}
    </div>
  );
}

function CardPaymentPanel({ form, errors, onChange, t }: StepProps) {
  const j = t.joinModal;
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-electric p-5 text-obsidian shadow-[0_0_40px_-10px_var(--color-cyan-glow)]">
        <div className="flex items-center justify-between">
          <div className="h-7 w-10 rounded-md bg-obsidian/15" />
          <Wifi className="h-5 w-5 rotate-90 text-obsidian/70" strokeWidth={1.75} />
        </div>
        <p className="mt-7 font-mono text-lg tracking-[0.25em]">{formatCardPreview(form.cardNumber)}</p>
        <div className="mt-6 flex items-end justify-between text-[11px] uppercase tracking-wide">
          <div>
            <p className="text-obsidian/60">{j.cardPreview.cardHolder}</p>
            <p className="font-semibold">{form.fullName.trim() || j.cardPreview.yourName}</p>
          </div>
          <div className="text-right">
            <p className="text-obsidian/60">{j.cardPreview.expires}</p>
            <p className="font-semibold">{form.cardExpiry || "MM/YY"}</p>
          </div>
        </div>
      </div>

      <Field label={j.fields.cardNumber} error={errors.cardNumber}>
        <input
          type="text"
          inputMode="numeric"
          value={form.cardNumber}
          onChange={(event) => onChange("cardNumber", formatCardNumberInput(event.target.value))}
          placeholder={j.fields.cardNumberPlaceholder}
          maxLength={19}
          className={inputClass(Boolean(errors.cardNumber))}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label={j.fields.expiry} error={errors.cardExpiry}>
          <input
            type="text"
            inputMode="numeric"
            value={form.cardExpiry}
            onChange={(event) => onChange("cardExpiry", formatExpiryInput(event.target.value))}
            placeholder="MM/YY"
            maxLength={5}
            className={inputClass(Boolean(errors.cardExpiry))}
          />
        </Field>
        <Field label={j.fields.cvc} error={errors.cardCvc}>
          <input
            type="text"
            inputMode="numeric"
            value={form.cardCvc}
            onChange={(event) => onChange("cardCvc", event.target.value)}
            placeholder="123"
            className={inputClass(Boolean(errors.cardCvc))}
          />
        </Field>
      </div>

      <p className="text-xs leading-relaxed text-silver">
        {j.cardNotePrefix}
        <span className="text-cyan-glow">{j.cardNoteHighlight}</span>
        {j.cardNoteSuffix}
      </p>
    </div>
  );
}

function formatCardNumberInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 16);
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

function formatExpiryInput(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function formatCardPreview(rawValue: string) {
  const digits = rawValue.replace(/\D/g, "").slice(0, 16);
  const padded = digits + "•".repeat(16 - digits.length);
  return padded.match(/.{1,4}/g)!.join("  ");
}

function InfoPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Wallet;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-silver">{description}</p>
      </div>
    </div>
  );
}

function BankRedirectOverlay() {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-6 bg-obsidian/95 px-4 text-center backdrop-blur-md">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow shadow-[0_0_56px_-10px_var(--color-cyan-glow)]">
        <Loader2 className="h-9 w-9 animate-spin" strokeWidth={2} />
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-glow">{t.joinModal.bankRedirect}</p>
    </div>
  );
}

function SubmittingState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-6 py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-cyan-glow/30 bg-cyan-glow/10 text-cyan-glow shadow-[0_0_56px_-10px_var(--color-cyan-glow)]">
        <Loader2 className="h-9 w-9 animate-spin" strokeWidth={2} />
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-glow">{label}</p>
    </div>
  );
}

function generateMembershipCode(tier: string) {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `BFG-${tier.slice(0, 3).toUpperCase()}-${random}`;
}

function SuccessState({
  tier,
  membershipCode,
  onClose,
  t,
}: {
  tier: string;
  membershipCode: string;
  onClose: () => void;
  t: Translations;
}) {
  const s = t.joinModal.success;
  const whatsappHref = `https://wa.me/38348367555?text=${encodeURIComponent(
    s.whatsappMessage(tier, membershipCode)
  )}`;

  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-400/40 bg-green-500/10 text-green-400 shadow-[0_0_56px_-8px_rgba(74,222,128,0.65)]">
        <CheckCircle2 className="h-10 w-10" strokeWidth={1.75} />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl">
          {s.titleStart}
          <span className="text-gradient-electric">{s.titleHighlight}</span>
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-silver">
          {s.subtitlePrefix}
          <span className="font-semibold text-foreground">{tier}</span>
          {s.subtitleSuffix}
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-cyan-glow/30 bg-white/5 text-cyan-glow">
          <QrCode className="h-20 w-20" strokeWidth={1} />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-silver">{s.membershipCodeLabel}</p>
        <p className="font-mono text-sm tracking-[0.25em] text-foreground">{membershipCode}</p>
      </div>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-electric px-8 py-3 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_32px_-6px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
        {s.whatsappCta}
      </a>

      <button
        type="button"
        onClick={onClose}
        className="text-xs font-semibold uppercase tracking-wide text-silver transition-colors duration-300 hover:text-cyan-glow"
      >
        {s.close}
      </button>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-silver">{label}</span>
      {children}
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-silver/50 outline-none transition-colors duration-300 focus:border-cyan-glow ${
    hasError ? "border-red-500/60" : "border-white/10"
  }`;
}
