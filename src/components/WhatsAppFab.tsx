"use client";

type WhatsAppFabProps = {
  message?: string;
  /** Extra bottom offset for pages with a mobile sticky bar */
  className?: string;
};

const WHATSAPP_NUMBER = "919521627701";

export function WhatsAppFab({
  message = "Hello, I need help with PGP.",
  className = "",
}: WhatsAppFabProps) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={`fixed z-50 right-4 bottom-24 sm:bottom-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.133-1.6-.79-1.848-.88-.248-.09-.429-.133-.61.134-.18.266-.7.88-.857 1.061-.157.178-.314.2-.582.067-.267-.133-1.13-.416-2.15-1.327-.795-.71-1.332-1.586-1.489-1.853-.156-.267-.017-.411.118-.543.121-.12.267-.314.4-.471.134-.157.178-.267.267-.445.09-.178.045-.334-.022-.468-.067-.133-.61-1.467-.835-2.01-.22-.53-.443-.458-.61-.467-.157-.009-.337-.01-.517-.01-.18 0-.47.067-.716.334-.248.267-.943.922-.943 2.25s.965 2.61 1.1 2.81c.133.2 1.896 2.895 4.596 4.061.643.277 1.144.443 1.535.567.645.205 1.231.176 1.694.107.517-.078 1.6-.653 1.826-1.284.225-.63.225-1.17.157-1.284-.067-.112-.247-.178-.514-.311z" />
        <path d="M12.004 2.003c-5.514 0-9.99 4.476-9.99 9.99 0 1.762.46 3.484 1.334 5.002L2 22l5.15-1.35A9.95 9.95 0 0 0 12.004 22c5.514 0 9.99-4.476 9.99-9.99s-4.476-10.007-9.99-10.007zm0 18.24a8.23 8.23 0 0 1-4.19-1.15l-.3-.178-3.056.801.816-2.98-.196-.306a8.24 8.24 0 0 1-1.266-4.397c0-4.55 3.703-8.253 8.253-8.253s8.253 3.703 8.253 8.253-3.703 8.31-8.314 8.31z" />
      </svg>
    </a>
  );
}
