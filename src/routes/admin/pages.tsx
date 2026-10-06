import { createFileRoute } from "@tanstack/react-router";
import { PagesSection } from "@/components/admin/PagesEditor";

export const Route = createFileRoute("/admin/pages")({
  component: AdminPages,
});

function AdminPages() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Pages</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Read and edit the text on the About, For Diaspora, Terms &amp; Conditions, Privacy Policy and
        Cookie Policy pages. Nothing changes on the website until you tap Save.
      </p>
      <div className="mt-6">
        <PagesSection />
      </div>
    </div>
  );
}
