import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listVehicles, listTours, listBookings, listInquiries } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState<{
    vehicles: number;
    tours: number;
    pendingBookings: number;
    newInquiries: number;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [vehicles, tours, bookings, inquiries] = await Promise.all([
        listVehicles(),
        listTours(),
        listBookings(),
        listInquiries(),
      ]);
      setCounts({
        vehicles: vehicles.length,
        tours: tours.length,
        pendingBookings: bookings.filter((b) => b.status === "pending").length,
        newInquiries: inquiries.filter((i) => i.status === "new").length,
      });
    })();
  }, []);

  const cards = [
    { label: "Fleet vehicles", value: counts?.vehicles, to: "/admin/fleet" },
    { label: "Tour destinations", value: counts?.tours, to: "/admin/tours" },
    { label: "Pending bookings", value: counts?.pendingBookings, to: "/admin/bookings" },
    { label: "New inquiries", value: counts?.newInquiries, to: "/admin/inquiries" },
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Overview of the VenMax site content and customer activity.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.label} to={card.to}>
            <Card className="transition-colors hover:border-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold text-foreground">{card.value ?? "…"}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
