import { Suspense } from "react";
import LoginPage from "./LoginPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-muted-foreground">
          Loading...
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
