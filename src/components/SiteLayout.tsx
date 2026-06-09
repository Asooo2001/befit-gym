import type { ReactNode } from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import JoinModalProvider from "./JoinModalProvider";
import LanguageProvider from "./LanguageProvider";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <JoinModalProvider>
        <div className="flex min-h-screen flex-col bg-obsidian text-foreground">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </JoinModalProvider>
    </LanguageProvider>
  );
}
