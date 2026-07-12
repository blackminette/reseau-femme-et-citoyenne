-- ==========================================
-- SUPABASE SECURITY & AUTHENTICATION SETUP
-- ==========================================
-- Ce script configure la synchronisation automatique des comptes
-- et les politiques de sécurité (RLS) sur Supabase.
--
-- INSTRUCTIONS :
-- Copiez et collez ce script dans l'éditeur SQL de votre console Supabase 
-- (SQL Editor -> New Query -> Run).
-- ==========================================

-- ──────────────────────────────────────────────────────────
-- 1. TRIGGER DE SYNCHRONISATION SUPABASE AUTH ↔ PRISMA
-- ──────────────────────────────────────────────────────────

-- Création ou mise à jour de la fonction de synchronisation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Utilisateur" (
    id,
    email,
    nom,
    prenom,
    role,
    "createdAt"
  )
  VALUES (
    new.id, -- Utilise l'UUID généré par Supabase Auth
    new.email,
    COALESCE(new.raw_user_meta_data->>'nom', 'Nom par défaut'),
    COALESCE(new.raw_user_meta_data->>'prenom', 'Prénom par défaut'),
    COALESCE(new.raw_user_meta_data->>'role', 'MEMBRE'), -- Rôle par défaut
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Création du trigger déclenché à la confirmation d'inscription
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ──────────────────────────────────────────────────────────
-- 2. ACTIVATION DE LA SÉCURITÉ ROW LEVEL SECURITY (RLS)
-- ──────────────────────────────────────────────────────────

ALTER TABLE public."Utilisateur" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ScoreQuiz" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Reservation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Atelier" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BoiteAIdees" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Don" ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────
-- 3. POLITIQUES DE SÉCURITÉ RLS PAR RÔLE
-- ──────────────────────────────────────────────────────────

-- Note: Les administrateurs ("ADMIN") ont accès à toutes les opérations sur toutes les tables.
-- On définit un helper pour identifier le rôle de l'utilisateur connecté via JWT
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    (SELECT role FROM public."Utilisateur" WHERE id = auth.uid()::text),
    'GUEST'
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- 🛡️ TABLE : Utilisateur (Profils)
-- ---------------------------------
CREATE POLICY "Les admins peuvent tout faire" ON public."Utilisateur"
  FOR ALL TO authenticated USING (public.get_auth_role() = 'ADMIN');

CREATE POLICY "Les tuteurs peuvent voir leurs enfants" ON public."Utilisateur"
  FOR SELECT TO authenticated USING (
    id = auth.uid()::text OR "tuteurId" = auth.uid()::text
  );

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON public."Utilisateur"
  FOR UPDATE TO authenticated USING (id = auth.uid()::text);


-- 🛡️ TABLE : ScoreQuiz (Quiz enfants)
-- -----------------------------------
CREATE POLICY "Les admins gèrent tous les scores" ON public."ScoreQuiz"
  FOR ALL TO authenticated USING (public.get_auth_role() = 'ADMIN');

CREATE POLICY "Les enfants voient leurs propres scores" ON public."ScoreQuiz"
  FOR SELECT TO authenticated USING ("etudiantId" = auth.uid()::text);

CREATE POLICY "Les enfants peuvent ajouter leurs propres scores" ON public."ScoreQuiz"
  FOR INSERT TO authenticated WITH CHECK ("etudiantId" = auth.uid()::text);


-- 🛡️ TABLE : Reservation (Ateliers)
-- ---------------------------------
CREATE POLICY "Les admins gèrent toutes les réservations" ON public."Reservation"
  FOR ALL TO authenticated USING (public.get_auth_role() = 'ADMIN');

CREATE POLICY "Les membres voient et gèrent leurs réservations" ON public."Reservation"
  FOR ALL TO authenticated USING (
    "utilisateurId" = auth.uid()::text
  );


-- 🛡️ TABLE : Atelier (Planning)
-- ------------------------------
CREATE POLICY "Lecture publique des ateliers" ON public."Atelier"
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Les admins et partenaires gèrent les ateliers" ON public."Atelier"
  FOR ALL TO authenticated USING (
    public.get_auth_role() = 'ADMIN' OR "partenaireId" = auth.uid()::text
  );
