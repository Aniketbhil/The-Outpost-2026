"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sparkles, BookmarkCheck } from "lucide-react";
import { useTracker } from "@/hooks/use-tracker";
import { ThemeToggle } from "@/components/theme-toggle";
import { ProfileButton } from "./ProfileButton";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const pathname = usePathname();
  const { count } = useTracker();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY <= 20) {
            setIsVisible(true);
          } else if (currentScrollY > lastScrollY.current && currentScrollY > 70) {
            // Scrolling down
            setIsVisible(false);
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up
            setIsVisible(true);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Discover", icon: Sparkles },
    { href: "/tracker", label: "My Tracker", icon: BookmarkCheck, count },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Wordmark Logo */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 py-2 font-heading text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 sm:text-2xl"
          aria-label="Grantly Home"
        >
          <span>Grantly</span>
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex min-h-[44px] items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring ${
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <span>{link.label}</span>
                {typeof link.count === "number" ? (
                  <Badge
                    variant="outline"
                    className="h-5 min-w-5 rounded-full border-accent/40 bg-accent/15 px-1.5 text-xs font-bold text-foreground"
                  >
                    {link.count}
                  </Badge>
                ) : null}
                {isActive ? (
                  <span
                    className="absolute inset-x-3.5 -bottom-2 h-0.5 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ProfileButton />
          <ThemeToggle />
        </div>

        {/* Mobile Navigation via Sheet */}
        <div className="flex items-center gap-2 md:hidden">
          <ProfileButton />
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-80 border-border bg-background p-6">
              <SheetHeader className="text-left pb-4 border-b border-border">
                <SheetTitle className="font-heading text-xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
                  <span>Grantly</span>
                  <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-2" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex min-h-[48px] items-center justify-between rounded-lg px-3.5 py-2.5 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-muted font-semibold text-foreground border border-border"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-5 text-accent" />
                        <span>{link.label}</span>
                      </div>
                      {typeof link.count === "number" ? (
                        <Badge
                          variant="outline"
                          className="h-6 min-w-6 rounded-full border-accent/40 bg-accent/15 px-2 text-xs font-bold text-foreground"
                        >
                          {link.count}
                        </Badge>
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
