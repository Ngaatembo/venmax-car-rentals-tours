-- Step 2 of 2: RLS for the 'developer' role (website maintenance, NO customer data).
--
-- Design notes
-- * has_role()/has_min_role() are NOT changed. has_min_role() only matches
--   admin/manager/staff, so a developer already fails every existing
--   "staff+" / "manager+" / "admin" policy. That covers bookings, customers,
--   inquiries, payments, documents, drivers, maintenance_records,
--   pricing_rules, audit_log, user_roles and the private documents bucket.
-- * This migration only ADDS narrow, explicit policies for website content.
-- * Developers get SELECT/INSERT/UPDATE (same as the manager tier). No DELETE.
-- * Nothing here touches, reads or rewrites any existing row.

-- Vehicles (prices, deposits, specs live on the vehicles row)
CREATE POLICY "developer read all vehicles" ON public.vehicles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer insert vehicles" ON public.vehicles
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer update vehicles" ON public.vehicles
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'developer'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));

-- Tours
CREATE POLICY "developer read all tours" ON public.tours
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer insert tours" ON public.tours
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer update tours" ON public.tours
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'developer'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));

-- Services
CREATE POLICY "developer read all services" ON public.services
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer insert services" ON public.services
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer update services" ON public.services
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'developer'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));

-- FAQs
CREATE POLICY "developer read all faqs" ON public.faqs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer insert faqs" ON public.faqs
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer update faqs" ON public.faqs
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'developer'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));

-- Testimonials
CREATE POLICY "developer read all testimonials" ON public.testimonials
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer insert testimonials" ON public.testimonials
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer update testimonials" ON public.testimonials
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'developer'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));

-- Site content (SELECT is already public)
CREATE POLICY "developer insert site content" ON public.site_content
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer update site content" ON public.site_content
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'developer'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'developer'::public.app_role));

-- Public website images (vehicle photos etc). The PRIVATE 'venmax-documents'
-- bucket is deliberately NOT included.
CREATE POLICY "developer upload venmax media" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'venmax-media' AND public.has_role(auth.uid(), 'developer'::public.app_role));
CREATE POLICY "developer update venmax media" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'venmax-media' AND public.has_role(auth.uid(), 'developer'::public.app_role));
