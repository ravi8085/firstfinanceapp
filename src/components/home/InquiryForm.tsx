import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name too long"),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  location: z.string().trim().min(1, "Location is required").max(100, "Location too long"),
});

type InquiryData = z.infer<typeof inquirySchema>;

const InquiryForm = () => {
  const [form, setForm] = useState<InquiryData>({ name: "", mobile: "", location: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = inquirySchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof InquiryData, string>> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof InquiryData;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    // Submit to Google Form
    // To wire up to a real Google Form, replace FORM_ID and entry IDs below
    // with values from your Google Form's prefilled link.
    const GOOGLE_FORM_ID = "REPLACE_WITH_FORM_ID";
    const ENTRY_NAME = "entry.1111111111";
    const ENTRY_MOBILE = "entry.2222222222";
    const ENTRY_LOCATION = "entry.3333333333";

    const body = new URLSearchParams();
    body.append(ENTRY_NAME, result.data.name);
    body.append(ENTRY_MOBILE, result.data.mobile);
    body.append(ENTRY_LOCATION, result.data.location);

    try {
      await fetch(
        `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`,
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        }
      );
      toast.success("Thanks! We'll reach out to you shortly.");
      setForm({ name: "", mobile: "", location: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-card rounded-2xl p-6 sm:p-10 border border-border shadow-card"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-3">
              Have questions? Get in touch.
            </h2>
            <p className="text-muted-foreground text-sm">
              Fill in the form and our advisor will reach out to you with personalized guidance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="inq-name">Name</Label>
              <Input
                id="inq-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your full name"
                maxLength={100}
                className="mt-1.5"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="inq-mobile">Mobile Number</Label>
              <Input
                id="inq-mobile"
                type="tel"
                inputMode="numeric"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
                placeholder="10-digit mobile number"
                className="mt-1.5"
              />
              {errors.mobile && <p className="text-xs text-destructive mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <Label htmlFor="inq-location">Location</Label>
              <Input
                id="inq-location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="City, State"
                maxLength={100}
                className="mt-1.5"
              />
              {errors.location && (
                <p className="text-xs text-destructive mt-1">{errors.location}</p>
              )}
            </div>

            <Button type="submit" disabled={submitting} className="w-full gap-2">
              <Send className="w-4 h-4" />
              {submitting ? "Submitting..." : "Submit Inquiry"}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default InquiryForm;
