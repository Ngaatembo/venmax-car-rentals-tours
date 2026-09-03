import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "surface" | "navy";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 lg:py-28",
        tone === "surface" && "bg-surface",
        tone === "navy" && "bg-navy text-navy-foreground",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  invert = false,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  invert?: boolean;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={cn("mt-3 text-3xl leading-tight sm:text-4xl", invert && "text-navy-foreground")}>
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            invert ? "text-navy-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
