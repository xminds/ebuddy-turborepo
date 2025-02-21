import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "../firebase/firebase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isInitialized, user } = useFirebaseAuth();

  useEffect(() => {
    if (isInitialized && !user) {
      router.push("/login");
    }
  }, [isInitialized, user, router]);

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
