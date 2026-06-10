"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";

const TIER_PACKAGE_IDS: Record<string, string> = {
  Basic: "basic",
  Premium: "premium",
  VIP: "vip",
};

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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRenew = async () => {
    setError(null);
    setIsRedirecting(true);

    try {
      const packageId = TIER_PACKAGE_IDS[tierName] ?? "basic";

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

  return (
    <div className="flex flex-col items-center gap-2">
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
            Renew Membership for 30 Days
          </>
        )}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
