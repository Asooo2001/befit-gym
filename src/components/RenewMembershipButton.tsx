"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import {
  PASS_DURATIONS,
  getPackageByName,
  getPackageById,
  type Gender,
  type PassDurationId,
} from "@/lib/membershipPlans";

interface RenewMembershipButtonProps {
  fullName: string;
  email: string;
  phone: string;
  tierName: string;
}

export default function RenewMembershipButton({
  fullName,
  email,
  phone,
  tierName,
}: RenewMembershipButtonProps) {
  const currentPackage = getPackageByName(tierName);
  const gender: Gender = currentPackage?.gender ?? "male";

  const [isChoosing, setIsChoosing] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<PassDurationId>(
    currentPackage?.durationId ?? "1month"
  );
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRenew = async () => {
    setError(null);
    setIsRedirecting(true);

    try {
      const packageId = `${gender}-${selectedDuration}`;

      const response = await fetch("/api/checkout/vpos-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, packageId }),
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
      setIsRedirecting(false);
      setError("Could not start the renewal. Please try again.");
    }
  };

  if (!isChoosing) {
    return (
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setIsChoosing(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-electric px-8 py-4 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_40px_-8px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105"
        >
          <Zap className="h-4 w-4" strokeWidth={2.25} />
          Renew Membership
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid w-full grid-cols-3 gap-2">
        {PASS_DURATIONS.map(({ id }) => {
          const pkg = getPackageById(`${gender}-${id}`)!;
          const isSelected = selectedDuration === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedDuration(id)}
              className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-colors duration-300 ${
                isSelected
                  ? "border-cyan-glow bg-cyan-glow/10 text-cyan-glow"
                  : "border-white/10 bg-white/5 text-silver hover:border-white/20 hover:text-foreground"
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide">
                {pkg.durationId === "1day"
                  ? "1 Day"
                  : pkg.durationId === "1week"
                    ? "1 Week"
                    : pkg.durationId === "1month"
                      ? "1 Month"
                      : pkg.durationId === "3months"
                        ? "3 Months"
                        : pkg.durationId === "6months"
                          ? "6 Months"
                          : "1 Year"}
              </span>
              <span className="text-sm font-bold text-foreground">€{pkg.price}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleRenew}
        disabled={isRedirecting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-electric px-8 py-4 text-sm font-semibold uppercase tracking-wide text-obsidian shadow-[0_0_40px_-8px_var(--color-cyan-glow)] transition-transform duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
      >
        {isRedirecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.25} />
            Redirecting&hellip;
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" strokeWidth={2.25} />
            Proceed to Payment
          </>
        )}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
