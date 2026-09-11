import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import {
  listSiteContent,
  setSiteContent,
  listServices,
  upsertService,
  deleteService,
  listFaqs,
  upsertFaq,
  deleteFaq,
  listTestimonials,
  upsertTestimonial,
  deleteTestimonial,
  type DbSiteContent,
  type DbService,
  type DbFaq,
  type DbTestimonial,
  type ServiceIcon,
} from "@/lib/admin-data";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

const fieldLabels: Record<string, string> = {
  hero_tagline: "Hero tagline",
  hero_subtitle: "Hero subtitle",
  contact_address: "Contact address",
  contact_phone_primary: "Primary phone",
  contact_phone_secondary: "Secondary phone",
  contact_email_sales: "Sales email",
  contact_email_bookings: "Bookings email",
  social_showcase_1: "Featured post/reel #1 (Instagram, TikTok or Facebook link)",
  social_showcase_2: "Featured post/reel #2 (Instagram, TikTok or Facebook link)",
  social_showcase_3: "Featured post/reel #3 (Instagram, TikTok or Facebook link)",
  social_showcase_4: "Featured post/reel #4 (Instagram, TikTok or Facebook link)",
  vehicle_models_display: "\"Vehicle Models\" homepage stat (e.g. 40+)",
};

type Tab = "general" | "services" | "faq" | "testimonials";

function AdminContent() {
  const [tab, setTab] = useState<Tab>("general");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Website Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage the public site's hero text, contact details, services, FAQ, and testimonials.
        Changes here update the live website.
      </p>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="mt-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-6">
        {tab === "general" && <GeneralSection />}
        {tab === "services" && <ServicesSection />}
        {tab === "faq" && <FaqSection />}
        {tab === "testimonials" && <TestimonialsSection />}
      </div>
    </div>
  );
}

// ---------------- General (existing key-value editor) ----------------
function GeneralSection() {
  const [items, setItems] = useState<DbSiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listSiteContent());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  function updateLocal(key: string, value: string) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, value } : i)));
  }

  async function handleSave(key: string, value: string) {
    setSavingKey(key);
    try {
      await setSiteContent(key, value);
      toast.success("Saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!loading &&
        items.map((item) => (
          <div key={item.key} className="rounded-lg border border-border bg-background p-4">
            <Label>{fieldLabels[item.key] ?? item.key}</Label>
            <div className="mt-2 flex gap-2">
              <Input value={item.value} onChange={(e) => updateLocal(item.key, e.target.value)} />
              <Button
                variant="secondary"
                onClick={() => handleSave(item.key, item.value)}
                disabled={savingKey === item.key}
              >
                {savingKey === item.key ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}

// ---------------- Services ----------------
const iconOptions: ServiceIcon[] = ["key", "user", "plane", "users"];

function ServicesSection() {
  const [services, setServices] = useState<DbService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbService>>({
    slug: "",
    name: "",
    description: "",
    icon: "key",
    whatsapp_message: "",
    sort_order: 0,
    is_active: true,
  });

  async function refresh() {
    setLoading(true);
    try {
      setServices(await listServices());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load services");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ slug: "", name: "", description: "", icon: "key", whatsapp_message: "", sort_order: services.length, is_active: true });
    setFormOpen(true);
  }
  function openEdit(s: DbService) {
    setEditingId(s.id);
    setForm(s);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.name?.trim() || !form.slug?.trim() || !form.description?.trim()) {
      toast.error("Name, slug, and description are required");
      return;
    }
    setSaving(true);
    try {
      await upsertService({
        ...(editingId ? { id: editingId } : {}),
        slug: form.slug.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        icon: (form.icon as ServiceIcon) || "key",
        whatsapp_message: form.whatsapp_message?.trim() || null,
        sort_order: form.sort_order ?? 0,
        is_active: form.is_active ?? true,
      });
      toast.success(editingId ? "Service updated" : "Service added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save service");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(s: DbService, active: boolean) {
    try {
      await upsertService({ id: s.id, slug: s.slug, name: s.name, description: s.description, is_active: active });
      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: active } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function handleDelete(s: DbService) {
    try {
      await deleteService(s.id);
      toast.success("Service deleted");
      setServices((prev) => prev.filter((x) => x.id !== s.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit service" : "Add service"}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div>
                <Label>Slug (unique)</Label>
                <Input value={form.slug ?? ""} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="e.g. self-drive" />
              </div>
              <div>
                <Label>Icon</Label>
                <Select value={form.icon ?? "key"} onValueChange={(v) => setForm((f) => ({ ...f, icon: v as ServiceIcon }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Name</Label>
                <Input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label>WhatsApp enquiry message</Label>
                <Input value={form.whatsapp_message ?? ""} onChange={(e) => setForm((f) => ({ ...f, whatsapp_message: e.target.value }))} />
              </div>
              <div>
                <Label>Order</Label>
                <Input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save service"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && services.length === 0 && <p className="text-sm text-muted-foreground">No services yet.</p>}
        {services.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{s.name}</p>
                <Badge variant="outline">{s.icon}</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={s.is_active} onCheckedChange={(v) => handleToggle(s, v)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{s.name}"?</AlertDialogTitle>
                    <AlertDialogDescription>This removes it from the public site.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(s)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- FAQ ----------------
function FaqSection() {
  const [faqs, setFaqs] = useState<DbFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbFaq>>({ question: "", answer: "", sort_order: 0, is_active: true });

  async function refresh() {
    setLoading(true);
    try {
      setFaqs(await listFaqs());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load FAQ");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ question: "", answer: "", sort_order: faqs.length, is_active: true });
    setFormOpen(true);
  }
  function openEdit(f: DbFaq) {
    setEditingId(f.id);
    setForm(f);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.question?.trim() || !form.answer?.trim()) {
      toast.error("Question and answer are required");
      return;
    }
    setSaving(true);
    try {
      await upsertFaq({
        ...(editingId ? { id: editingId } : {}),
        question: form.question.trim(),
        answer: form.answer.trim(),
        sort_order: form.sort_order ?? 0,
        is_active: form.is_active ?? true,
      });
      toast.success(editingId ? "FAQ updated" : "FAQ added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(f: DbFaq, active: boolean) {
    try {
      await upsertFaq({ id: f.id, question: f.question, answer: f.answer, is_active: active });
      setFaqs((prev) => prev.map((x) => (x.id === f.id ? { ...x, is_active: active } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function handleDelete(f: DbFaq) {
    try {
      await deleteFaq(f.id);
      toast.success("FAQ deleted");
      setFaqs((prev) => prev.filter((x) => x.id !== f.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Question</Label>
                <Input value={form.question ?? ""} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea value={form.answer ?? ""} onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))} />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <Label>Order</Label>
                  <Input type="number" className="w-24" value={form.sort_order ?? 0} onChange={(e) => setForm((f) => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && faqs.length === 0 && <p className="text-sm text-muted-foreground">No FAQs yet.</p>}
        {faqs.map((f) => (
          <div key={f.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-4">
            <div>
              <p className="font-medium text-foreground">{f.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.answer}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Switch checked={f.is_active} onCheckedChange={(v) => handleToggle(f, v)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this question?</AlertDialogTitle>
                    <AlertDialogDescription>This removes it from the public FAQ section.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(f)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------- Testimonials ----------------
function TestimonialsSection() {
  const [items, setItems] = useState<DbTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<DbTestimonial>>({ customer_name: "", rating: 5, quote: "", sort_order: 0, is_active: true });

  async function refresh() {
    setLoading(true);
    try {
      setItems(await listTestimonials());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm({ customer_name: "", rating: 5, quote: "", sort_order: items.length, is_active: true });
    setFormOpen(true);
  }
  function openEdit(t: DbTestimonial) {
    setEditingId(t.id);
    setForm(t);
    setFormOpen(true);
  }

  async function handleSave() {
    if (!form.customer_name?.trim() || !form.quote?.trim()) {
      toast.error("Name and quote are required");
      return;
    }
    setSaving(true);
    try {
      await upsertTestimonial({
        ...(editingId ? { id: editingId } : {}),
        customer_name: form.customer_name.trim(),
        rating: form.rating ?? 5,
        quote: form.quote.trim(),
        sort_order: form.sort_order ?? 0,
        is_active: form.is_active ?? true,
      });
      toast.success(editingId ? "Testimonial updated" : "Testimonial added");
      setFormOpen(false);
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(t: DbTestimonial, active: boolean) {
    try {
      await upsertTestimonial({ id: t.id, customer_name: t.customer_name, rating: t.rating, quote: t.quote, is_active: active });
      setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, is_active: active } : x)));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  async function handleDelete(t: DbTestimonial) {
    try {
      await deleteTestimonial(t.id);
      toast.success("Testimonial deleted");
      setItems((prev) => prev.filter((x) => x.id !== t.id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit testimonial" : "Add testimonial"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Customer name</Label>
                <Input value={form.customer_name ?? ""} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} />
              </div>
              <div>
                <Label>Rating (1–5)</Label>
                <Select value={String(form.rating ?? 5)} onValueChange={(v) => setForm((f) => ({ ...f, rating: parseInt(v) }))}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((r) => <SelectItem key={r} value={String(r)}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quote</Label>
                <Textarea value={form.quote ?? ""} onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))} />
                <Label>Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4 space-y-3">
        {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!loading && items.length === 0 && <p className="text-sm text-muted-foreground">No testimonials yet.</p>}
        {items.map((t) => (
          <div key={t.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{t.customer_name}</p>
                <span className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.quote}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Switch checked={t.is_active} onCheckedChange={(v) => handleToggle(t, v)} />
              <Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this testimonial?</AlertDialogTitle>
                    <AlertDialogDescription>This removes it from the public site.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(t)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
