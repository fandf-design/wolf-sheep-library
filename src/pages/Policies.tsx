import { useParams, Link } from "react-router-dom";

type PolicyType = "privacy" | "terms" | "returns" | "shipping";

const policyContent: Record<PolicyType, { title: string; content: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    content: [
      "Fang & Fleece collects only the information necessary to process orders and improve your experience.",
      "We do not sell or share your personal information with third parties for marketing purposes.",
      "Payment information is processed securely through Shopify and is never stored on our servers.",
      "You may request deletion of your personal data by contacting us directly.",
      "We use cookies to maintain your cart and preferences. No tracking cookies are used without consent.",
    ],
  },
  terms: {
    title: "Terms of Service",
    content: [
      "By using this site, you agree to these terms. Products are subject to availability.",
      "All content on this site, including text, images, and design, is the property of Fang & Fleece.",
      "Prices are subject to change without notice. Payment is due at the time of purchase.",
      "We reserve the right to refuse service to anyone for any reason at any time.",
      "These terms are governed by applicable law. Disputes will be resolved through binding arbitration.",
    ],
  },
  returns: {
    title: "Return Policy",
    content: [
      "Returns are accepted within 14 days of delivery for items in original, unworn condition.",
      "Items must include all original tags and packaging.",
      "Return shipping costs are the responsibility of the customer unless the item is defective.",
      "Refunds will be processed to the original payment method within 5-7 business days of receiving the return.",
      "Final sale items and custom orders are not eligible for return.",
    ],
  },
  shipping: {
    title: "Shipping Policy",
    content: [
      "Standard shipping within the United States takes 5-7 business days.",
      "International shipping is available to select countries and may take 10-21 business days.",
      "Shipping costs are calculated at checkout based on destination and order weight.",
      "Orders are processed within 1-2 business days. You will receive tracking information via email.",
      "We are not responsible for delays caused by customs or postal services for international orders.",
    ],
  },
};

const Policies = () => {
  const { type } = useParams<{ type: string }>();
  const policy = policyContent[type as PolicyType];

  if (!policy) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-lg mb-4">Policy Not Found</h1>
          <Link to="/" className="link-archival">
            Return to Library
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-4xl mx-auto page-enter">
          <div className="mb-6">
            <Link to="/" className="text-meta text-muted-foreground hover:text-accent transition-colors">
              Library
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <span className="text-meta text-muted-foreground">Policies</span>
          </div>
          <h1 className="text-display-xl">{policy.title}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            {policy.content.map((paragraph, index) => (
              <p key={index} className="text-body text-muted-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border/50">
            <p className="text-meta text-muted-foreground/60">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Policies;
