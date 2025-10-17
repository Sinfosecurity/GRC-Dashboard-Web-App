import MockGRCApp from "@/components/grc/MockGRCApp";
import AuthGuard from "@/components/auth-guard";

export default function DashboardPage() { 
  return (
    <AuthGuard>
      <MockGRCApp />
    </AuthGuard>
  );
}
