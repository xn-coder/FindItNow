"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, Sparkles, Sprout } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navLinks = [
  { href: "/browse", label: "Browse", icon: MapPin },
  { href: "/map", label: "Map View", icon: MapPin },
];

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-card/80 backdrop-blur-lg sticky top-0 z-50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary font-headline">
          <Sprout className="h-7 w-7" />
          FindItNow
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/report-found">Report Found</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/report-lost">Report Lost</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Login</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
                <SheetHeader className="p-4 pb-0">
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary font-headline" onClick={() => setMobileMenuOpen(false)}>
                            <Sprout className="h-7 w-7" />
                            FindItNow
                        </Link>
                    </SheetTitle>
                </SheetHeader>
              <div className="p-4">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md p-2 text-base font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                      <link.icon className="h-5 w-5 text-primary" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-8 flex flex-col gap-2">
                  <Button asChild>
                    <Link href="/report-lost" onClick={() => setMobileMenuOpen(false)}>Report Lost Item</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/report-found" onClick={() => setMobileMenuOpen(false)}>Report Found Item</Link>
                  </Button>
                  <Button asChild variant="ghost" className="mt-4">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login / Sign Up</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
