import SiteLayout from "@/components/SiteLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteLayout>{children}</SiteLayout>;
}
