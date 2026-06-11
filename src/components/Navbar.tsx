"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/chat", label: "Talk to Future Me" },
  { href: "/interest-test", label: "Interest Test" },
  { href: "/careers", label: "Career Explorer" },
  { href: "/compare", label: "Compare" },
  { href: "/saved", label: "Saved" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <span>Future<span className="text-violet-600">Me</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href ? "text-violet-600" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quiz"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors"
            >
              Take the Quiz
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-3 pb-4 border-t border-slate-100 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2 text-sm font-medium text-slate-700 hover:text-violet-600"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quiz"
              onClick={() => setOpen(false)}
              className="mx-2 mt-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center hover:bg-violet-700"
            >
              Take the Quiz
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
