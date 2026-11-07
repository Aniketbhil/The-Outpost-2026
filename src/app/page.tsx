import type { Metadata } from "next";
import { DemoActions } from "@/components/demo-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Compass, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Grantly - Find scholarships that fit you",
  description:
    "Discover, match, and track your scholarship applications with an intuitive, local-first interface.",
};

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {/* Hero Section */}
      <section className="flex flex-col items-start gap-6 max-w-3xl">
        <Badge
          variant="outline"
          className="gap-1.5 border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-foreground"
        >
          <Sparkles className="size-3.5 text-accent" />
          <span>Foundation Ready &bull; 3-Color Strict Token System</span>
        </Badge>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
          Find scholarships that fit you<span className="text-accent">.</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Grantly is a streamlined, privacy-first scholarship discovery and application tracking workspace.
          Zero accounts, zero tracking databases, 100% local in your browser.
        </p>
      </section>

      {/* Interactive Verification Leaf */}
      <section aria-labelledby="verifier-heading">
        <h2 id="verifier-heading" className="sr-only">
          Store &amp; Token Verifier
        </h2>
        <DemoActions />
      </section>

      {/* Token Verification Grid: 3 Colors & Typography */}
      <section className="flex flex-col gap-8" aria-labelledby="tokens-heading">
        <div className="flex flex-col gap-2">
          <h2 id="tokens-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            Token System &amp; Visual Spec
          </h2>
          <p className="text-sm text-muted-foreground">
            Strictly 3 colors across light &amp; dark themes, derived shades via color-mix(), and two curated typefaces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Palette Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground">
                3-Color System
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Strict single-hue hierarchy
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                <span className="text-sm font-medium text-foreground">1. Background</span>
                <span className="text-xs text-muted-foreground font-mono">#F8F9FA / #121214</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-primary text-primary-foreground p-3">
                <span className="text-sm font-medium">2. Primary</span>
                <span className="text-xs opacity-80 font-mono">#18181B / #ECECEF</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-accent bg-accent text-accent-foreground p-3">
                <span className="text-sm font-semibold">3. Accent</span>
                <span className="text-xs opacity-90 font-mono">#E76F51 / #F08A6D</span>
              </div>
            </CardContent>
          </Card>

          {/* Typography Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground">
                Type Scale
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Fraunces (Headings) + DM Sans (Body)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <div className="font-heading text-2xl font-bold text-foreground">
                Fraunces Heading 2xl
              </div>
              <div className="font-heading text-xl font-semibold text-foreground">
                Fraunces Heading xl
              </div>
              <div className="text-base text-foreground">
                DM Sans Body Regular (16px / 1.5)
              </div>
              <div className="text-sm text-muted-foreground">
                DM Sans Caption &amp; Meta (14px)
              </div>
              <div className="text-xs text-muted-foreground">
                DM Sans Micro Labels &amp; Badges (12px)
              </div>
            </CardContent>
          </Card>

          {/* Status System Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="font-heading text-xl text-foreground">
                Accent Status Paradigm
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Status conveyed via accent + icon + text
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between rounded-md border border-border p-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle2 className="size-4 text-accent" />
                  <span>Preparing</span>
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent">Active</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <ShieldCheck className="size-4 text-accent" />
                  <span>Applied</span>
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent">Submitted</Badge>
              </div>
              <div className="flex items-center justify-between rounded-md border border-border p-2">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Compass className="size-4 text-accent" />
                  <span>Awarded</span>
                </div>
                <Badge variant="outline" className="border-accent/30 text-accent">Success</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
