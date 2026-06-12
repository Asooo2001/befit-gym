"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Check, CreditCard, Loader2, X } from "lucide-react";
import { useJoinModal } from "./JoinModalProvider";
import { useLanguage } from "./LanguageProvider";
import type { Translations } from "@/lib/translations";
import { PASS_DURATIONS, getPackageById, type Gender, type PassDurationId } from "@/lib/membershipPlans";

const GENDERS: Gender[] = ["female", "male"];

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  gender: Gender | null;
  passId: PassDurationId | null;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  gender: null,
  passId: null,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s-]{6,}$/;

export default function JoinModal() {
  const { isOpen, selectedGender, sessionId, closeJoinModal } = useJoinModal();

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
  // freshly chosen gender pre-selected) every time the modal is opened.
  return <JoinModalContent key={sessionId} initialGender={selectedGender} onClose={closeJoinModal} />;
}

function JoinModalContent({
  initialGender,
  onClose,
}: {
  initialGender: Gender | null;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>({ ...INITIAL_FORM, gender: initialGender });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isRedirectingToBank, setIsRedirectingToBank] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = () => {
    const next: FormErrors = {};
    if (!form.fullName.trim()) next.fullName = t.joinModal.errors.fullName;
    if (!EMAIL_PATTERN.test(form.email)) next.email = t.joinModal.errors.email;
    if (!PHONE_PATTERN.test(form.phone)) next.phone = t.joinModal.errors.phone;
    if (!form.gender) next.gender = t.joinModal.errors.gender;
    if (!form.passId) next.passId = t.joinModal.errors.passId;
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
    await redirectToBankTerminal();
  };

  const redirectToBankTerminal = async () => {
    setBankError(null);
    setIsRedirectingToBank(true);

    try {
      const selectedPackage = getPackageById(`${form.gender!}-${form.passId!}`)!;

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
      setBankError(t.joinModal.errors.bankTerminal);
    }
  };

  const handleClose = () => {
    if (isRedirectingToBank) return;
    onClose();
  };

  const planLabel =
    form.gender && form.passId
      ? `${t.pricing.genders[form.gender].title} · ${t.pricing.passes[form.passId]}`
      : "";

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
          disabled={isRedirectingToBank}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-silver transition-colors duration-300 hover:border-cyan-glow hover:text-cyan-glow disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>

        <div className="overflow-y-auto px-6 pb-8 pt-8 sm:px-8">
          <>
              <div>
                {planLabel && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-glow">
                    {t.joinModal.membershipBadge(planLabel)}
                  </span>
                )}
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
                  <PaymentStep planLabel={planLabel} bankError={bankError} t={t} />
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
                      {t.joinModal.buttons.proceedToPayment}
                    </button>
                  )}
                </div>
              </form>
            </>
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

      <Field label={f.gender} error={errors.gender}>
        <div className="grid grid-cols-2 gap-3">
          {GENDERS.map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => onChange("gender", gender)}
              className={`rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-colors duration-300 ${
                form.gender === gender
                  ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow"
                  : "border-white/10 bg-white/5 text-silver hover:border-white/20 hover:text-foreground"
              }`}
            >
              {t.pricing.genders[gender].title}
            </button>
          ))}
        </div>
      </Field>

      {form.gender && (
        <Field label={f.membershipPlan} error={errors.passId}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PASS_DURATIONS.map(({ id }) => {
              const pkg = getPackageById(`${form.gender}-${id}`)!;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange("passId", id)}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-colors duration-300 ${
                    form.passId === id
                      ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow"
                      : "border-white/10 bg-white/5 text-silver hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide">{t.pricing.passes[id]}</span>
                  <span className="text-sm font-bold text-foreground">€{pkg.price}</span>
                </button>
              );
            })}
          </div>
        </Field>
      )}
    </div>
  );
}

function PaymentStep({
  planLabel,
  bankError,
  t,
}: {
  planLabel: string;
  bankError: string | null;
  t: Translations;
}) {
  const j = t.joinModal;

  return (
    <div className="flex flex-col gap-5">
      {planLabel && (
        <p className="text-sm text-silver">
          {j.membershipBadge(planLabel)}
        </p>
      )}

      <InfoPanel icon={CreditCard} title={j.infoPanels.card.title} description={j.infoPanels.card.description} />

      {bankError && <p className="text-xs text-red-400">{bankError}</p>}
    </div>
  );
}

function InfoPanel({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof CreditCard;
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
