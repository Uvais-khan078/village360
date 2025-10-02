import { AuthProvider as BaseAuthProvider } from "@/hooks/use-auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <BaseAuthProvider>{children}</BaseAuthProvider>;
}
