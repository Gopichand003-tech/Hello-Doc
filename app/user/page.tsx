import HeroHospital from "@/app/components/user/Hero";
import DoctorsPage from "@/app/components/user/AllDoctors";
import { Footer } from "@/app/components/user/Footer";
import RequireRole from "@/app/components/auth/RequireRole";
import dynamic from "next/dynamic";

const TestimonialsSection = dynamic(
  () =>
    import("@/app/components/user/TestinomialsSection").then(
      (mod) => mod.TestimonialsSection
    ),
  { ssr: false }
);

const HowItWorks = dynamic(
  () =>
    import("@/app/components/user/Howitworks").then(
      (mod) => mod.HowItWorks
    ),
  { ssr: false }
);

const CTA = dynamic(
  () =>
    import("@/app/components/user/CTA").then(
      (mod) => mod.CTASection
    ),
  { ssr: false }
);

export default function HomePage() {
  return (
    <RequireRole allowedRoles={["PATIENT"]}>
      <HeroHospital />
      <DoctorsPage />
      <HowItWorks />
      <TestimonialsSection />
      <CTA />
      <Footer />
    </RequireRole>
  );
}
