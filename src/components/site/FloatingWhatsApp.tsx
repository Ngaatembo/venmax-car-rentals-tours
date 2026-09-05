import { useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/venmax";

export function FloatingWhatsApp() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappLink("Hello VenMax, I'd like to enquire about a booking.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with VenMax on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle className="h-7 w-7 fill-white text-[#25D366]" />
    </a>
  );
}
