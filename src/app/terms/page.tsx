import type { Metadata } from "next";
import { POLICY_DOCUMENTS } from "@/config/policies";
import { PolicyPageView } from "@/components/PolicyPageView";

const doc = POLICY_DOCUMENTS.terms;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.metaDescription,
  alternates: {
    canonical: doc.slug,
  },
};

export default function TermsOfServicePage() {
  return <PolicyPageView policyKey="terms" />;
}
