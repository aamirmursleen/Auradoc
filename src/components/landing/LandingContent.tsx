import HeroSection from "@/components/landing/HeroSection";
import TrustedBy from "@/components/landing/TrustedBy";
import SignatureDemo from "@/components/landing/SignatureDemo";
import ResumeBuilder from "@/components/landing/ResumeBuilder";
import InvoiceCalculator from "@/components/landing/InvoiceCalculator";
import CustomDomain from "@/components/landing/CustomDomain";
import DocumentVerification from "@/components/landing/DocumentVerification";
import AnalyticsDashboard from "@/components/landing/AnalyticsDashboard";
import TeamCollaboration from "@/components/landing/TeamCollaboration";
import ApiIntegration from "@/components/landing/ApiIntegration";
import PricingComparison from "@/components/landing/PricingComparison";
import Testimonials from "@/components/landing/Testimonials";
import BentoGrid from "@/components/landing/BentoGrid";
import FaqSection from "@/components/landing/FaqSection";
import FinalCta from "@/components/landing/FinalCta";

const LandingContent = () => {
  return (
    <>
      <HeroSection />
      <TrustedBy />
      <SignatureDemo />
      <ResumeBuilder />
      <InvoiceCalculator />
      <CustomDomain />
      <DocumentVerification />
      <AnalyticsDashboard />
      <TeamCollaboration />
      <ApiIntegration />
      <PricingComparison />
      <Testimonials />
      <BentoGrid />
      <FaqSection />
      <FinalCta />
    </>
  );
};

export default LandingContent;
