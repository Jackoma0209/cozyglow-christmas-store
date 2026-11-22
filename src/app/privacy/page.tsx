import type { Metadata } from "next";
import { POLICY_DOCUMENTS } from "@/config/policies";
import { PolicyPageView } from "@/components/PolicyPageView";

const doc = POLICY_DOCUMENTS.privacy;

export const metadata: Metadata = {
  title: `${doc.title} | CozyGlow™ Home Aromatics`,
  description: doc.metaDescription,
};

export default function PrivacyPolicyPage() {
  return <PolicyPageView policyKey="privacy" />;
}
