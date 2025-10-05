import { Suspense } from "react";
import PrimaryLayout from "@/components/layouts/PrimaryLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrimaryLayout>
        {children}
      </PrimaryLayout>
    </Suspense>
  );
}
