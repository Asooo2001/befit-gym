"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import JoinModal from "./JoinModal";
import type { Gender } from "@/lib/membershipPlans";

type JoinModalContextValue = {
  isOpen: boolean;
  selectedGender: Gender | null;
  /** Increments on every `openJoinModal` call — use as a React `key` to mount a fresh form each time. */
  sessionId: number;
  openJoinModal: (gender?: Gender) => void;
  closeJoinModal: () => void;
};

const JoinModalContext = createContext<JoinModalContextValue | null>(null);

export function useJoinModal() {
  const context = useContext(JoinModalContext);
  if (!context) {
    throw new Error("useJoinModal must be used within a JoinModalProvider");
  }
  return context;
}

export default function JoinModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [sessionId, setSessionId] = useState(0);

  const openJoinModal = useCallback((gender?: Gender) => {
    setSelectedGender(gender ?? null);
    setSessionId((id) => id + 1);
    setIsOpen(true);
  }, []);

  const closeJoinModal = useCallback(() => setIsOpen(false), []);

  return (
    <JoinModalContext.Provider value={{ isOpen, selectedGender, sessionId, openJoinModal, closeJoinModal }}>
      {children}
      <JoinModal />
    </JoinModalContext.Provider>
  );
}
