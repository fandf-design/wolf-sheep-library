import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success("Message sent", {
      description: "We will respond within 2-3 business days.",
      position: "top-center",
    });
    
    setForm({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-4xl mx-auto page-enter">
          <span className="text-meta block mb-6">Correspondence</span>
          <h1 className="text-display-xl mb-6">Contact</h1>
          <p className="text-body text-lg text-muted-foreground max-w-2xl">
            For inquiries regarding orders, collaborations, or the archive itself.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-ui text-muted-foreground block mb-2">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                className="bg-muted/30 border-border/50"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-ui text-muted-foreground block mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="bg-muted/30 border-border/50"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-ui text-muted-foreground block mb-2">
                Message
              </Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your inquiry..."
                rows={6}
                className="bg-muted/30 border-border/50 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>

          <div className="mt-16 pt-8 border-t border-border/50 text-center">
            <p className="text-body-sm text-muted-foreground">
              Response time: 2-3 business days
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
