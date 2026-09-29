import { useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/venmax";

export function FloatingWhatsApp() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;

  const href = whatsappLink("Hi VenMax, I'd like to enquire about renting a vehicle. Please help me with the available options.");

  return (
    <>
      {/* Mobile: sticky bottom CTA bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-3 border-t border-black/10 bg-background/95 p-3 backdrop-blur sm:hidden">
        <a
          href="/fleet"
          className="flex items-center justify-center rounded-full border border-border bg-background px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-foreground"
        >
          View Vehicles
        </a>
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
      {/* Tablet/desktop: floating button */}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with VenMax on WhatsApp"
        className="fixed bottom-5 right-5 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95 sm:flex"
      >
        <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
      </a>
    </>
  );
}
