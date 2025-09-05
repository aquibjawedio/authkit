import { ShieldCheck, Database, Fingerprint, LockKeyhole } from "lucide-react";

const securityFeatures = [
  {
    icon: ShieldCheck,
    title: "Email Verification",
    description:
      "Verify users with secure, tokenized email links to prevent spam and fraud.",
  },
  {
    icon: Database,
    title: "Session Management",
    description:
      "Robust session handling using HTTP-only cookies for persistent and secure logins.",
  },
  {
    icon: Fingerprint,
    title: "Data Validation",
    description:
      "All inputs are validated on both client and server to prevent injection and malformed data.",
  },
  {
    icon: LockKeyhole,
    title: "PostgreSQL Hardening",
    description:
      "Queries are parameterized and roles scoped to enforce least-privilege access.",
  },
];

const SecurityFeatures = () => {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">Secure by Design</h2>
      <p className="max-w-2xl mx-auto text-muted-foreground mb-12">
        AuthKit is built on the rock-solid PERN stack with security baked into
        every layer — from database to frontend.
      </p>

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
        {securityFeatures.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="flex flex-col items-center gap-3">
              <Icon className="w-10 h-10 text-primary" />
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SecurityFeatures;
