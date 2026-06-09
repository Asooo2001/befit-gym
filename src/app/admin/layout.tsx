export const metadata = {
  title: "Be Fit Gym — Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full">{children}</div>;
}
