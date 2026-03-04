-- ============================================================
-- GHWC Initial Schema Migration
-- Tables: members, categories, descriptions, transactions,
--         tasks, task_volunteers
-- View:   balances
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Members
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('active', 'pending', 'inactive')),
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('member', 'manager', 'admin')),
  onboarded_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Descriptions (sub-labels under categories)
CREATE TABLE descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members ON DELETE RESTRICT,
  type TEXT NOT NULL
    CHECK (type IN ('earned', 'used', 'donated')),
  hours NUMERIC(6,2) NOT NULL
    CHECK (hours > 0),
  category_id UUID REFERENCES categories ON DELETE RESTRICT,
  description TEXT,
  activity_date DATE NOT NULL,
  month TEXT,
  year INTEGER,
  submitted_by UUID REFERENCES members ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'approved'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES members ON DELETE RESTRICT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tasks (schema only — UI built in Phase 2)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID NOT NULL REFERENCES members ON DELETE RESTRICT,
  title TEXT NOT NULL,
  description TEXT,
  urgency TEXT
    CHECK (urgency IN ('urgent', 'time_bound', 'flexible')),
  preferred_dates TEXT,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'posted', 'completed', 'cancelled')),
  pets_present BOOLEAN NOT NULL DEFAULT false,
  children_welcome BOOLEAN NOT NULL DEFAULT false,
  mask_required BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Task Volunteers (schema only — UI built in Phase 2)
CREATE TABLE task_volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks ON DELETE RESTRICT,
  member_id UUID NOT NULL REFERENCES members ON DELETE RESTRICT,
  status TEXT
    CHECK (status IN ('confirmed', 'completed', 'cancelled')),
  hours_submitted BOOLEAN NOT NULL DEFAULT false,
  transaction_id UUID REFERENCES transactions ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- BALANCES VIEW
-- ============================================================

CREATE VIEW balances WITH (security_invoker = true) AS
SELECT
  member_id,
  COALESCE(SUM(CASE WHEN type = 'earned' THEN hours ELSE 0 END), 0) AS hours_earned,
  COALESCE(SUM(CASE WHEN type = 'used' THEN hours ELSE 0 END), 0) AS hours_used,
  COALESCE(SUM(CASE WHEN type = 'donated' THEN hours ELSE 0 END), 0) AS hours_donated,
  COALESCE(SUM(CASE WHEN type = 'earned' THEN hours ELSE 0 END), 0)
    - COALESCE(SUM(CASE WHEN type = 'used' THEN hours ELSE 0 END), 0)
    - COALESCE(SUM(CASE WHEN type = 'donated' THEN hours ELSE 0 END), 0) AS available
FROM transactions
WHERE status = 'approved'
GROUP BY member_id;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_volunteers ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------
-- Helper function: get current member's role
-- ----------------------------------------
CREATE OR REPLACE FUNCTION get_member_role()
RETURNS TEXT AS $$
  SELECT role FROM members WHERE auth_user_id = (select auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public;

-- ----------------------------------------
-- Helper function: get current member's id
-- ----------------------------------------
CREATE OR REPLACE FUNCTION get_member_id()
RETURNS UUID AS $$
  SELECT id FROM members WHERE auth_user_id = (select auth.uid());
$$ LANGUAGE sql SECURITY DEFINER STABLE
SET search_path = public;

-- ----------------------------------------
-- MEMBERS policies
-- ----------------------------------------

-- Members can read their own row, admins can read all
CREATE POLICY "members_select"
  ON members FOR SELECT
  TO authenticated
  USING (
    auth_user_id = (select auth.uid())
    OR (select get_member_role()) = 'admin'
  );

-- Admins can update all members
CREATE POLICY "members_update_admin"
  ON members FOR UPDATE
  TO authenticated
  USING ((select get_member_role()) = 'admin');

-- ----------------------------------------
-- CATEGORIES policies
-- ----------------------------------------

-- All authenticated users can read active categories
CREATE POLICY "categories_select"
  ON categories FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Managers and admins can insert categories
CREATE POLICY "categories_insert"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK ((select get_member_role()) IN ('manager', 'admin'));

-- Managers and admins can update categories
CREATE POLICY "categories_update"
  ON categories FOR UPDATE
  TO authenticated
  USING ((select get_member_role()) IN ('manager', 'admin'));

-- ----------------------------------------
-- DESCRIPTIONS policies
-- ----------------------------------------

-- All authenticated users can read active descriptions
CREATE POLICY "descriptions_select"
  ON descriptions FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Managers and admins can insert descriptions
CREATE POLICY "descriptions_insert"
  ON descriptions FOR INSERT
  TO authenticated
  WITH CHECK ((select get_member_role()) IN ('manager', 'admin'));

-- Managers and admins can update descriptions
CREATE POLICY "descriptions_update"
  ON descriptions FOR UPDATE
  TO authenticated
  USING ((select get_member_role()) IN ('manager', 'admin'));

-- ----------------------------------------
-- TRANSACTIONS policies
-- ----------------------------------------

-- Members see own transactions, managers/admins see all
CREATE POLICY "transactions_select"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    member_id = (select get_member_id())
    OR (select get_member_role()) IN ('manager', 'admin')
  );

-- Members can insert as pending, managers/admins can insert any
CREATE POLICY "transactions_insert"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (
    (member_id = (select get_member_id()) AND status = 'pending')
    OR (select get_member_role()) IN ('manager', 'admin')
  );

-- Managers and admins can update transactions
CREATE POLICY "transactions_update"
  ON transactions FOR UPDATE
  TO authenticated
  USING ((select get_member_role()) IN ('manager', 'admin'));

-- ----------------------------------------
-- TASKS policies
-- ----------------------------------------

-- Members see approved/posted + own tasks, managers/admins see all
CREATE POLICY "tasks_select"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    status IN ('approved', 'posted')
    OR requested_by = (select get_member_id())
    OR (select get_member_role()) IN ('manager', 'admin')
  );

-- Members can insert tasks for themselves
CREATE POLICY "tasks_insert"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (requested_by = (select get_member_id()));

-- Managers and admins can update tasks
CREATE POLICY "tasks_update"
  ON tasks FOR UPDATE
  TO authenticated
  USING ((select get_member_role()) IN ('manager', 'admin'));

-- ----------------------------------------
-- TASK_VOLUNTEERS policies
-- ----------------------------------------

-- Members see own records, managers/admins see all
CREATE POLICY "task_volunteers_select"
  ON task_volunteers FOR SELECT
  TO authenticated
  USING (
    member_id = (select get_member_id())
    OR (select get_member_role()) IN ('manager', 'admin')
  );

-- Members can volunteer themselves
CREATE POLICY "task_volunteers_insert"
  ON task_volunteers FOR INSERT
  TO authenticated
  WITH CHECK (member_id = (select get_member_id()));

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_members_auth_user_id ON members (auth_user_id);
CREATE INDEX idx_members_email ON members (email);
CREATE INDEX idx_transactions_member_id ON transactions (member_id);
CREATE INDEX idx_transactions_activity_date ON transactions (activity_date);
CREATE INDEX idx_transactions_status ON transactions (status);
CREATE INDEX idx_descriptions_category_id ON descriptions (category_id);
CREATE INDEX idx_task_volunteers_task_id ON task_volunteers (task_id);
CREATE INDEX idx_task_volunteers_member_id ON task_volunteers (member_id);
CREATE INDEX idx_task_volunteers_transaction_id ON task_volunteers (transaction_id);
CREATE INDEX idx_tasks_requested_by ON tasks (requested_by);
CREATE INDEX idx_transactions_category_id ON transactions (category_id);
CREATE INDEX idx_transactions_reviewed_by ON transactions (reviewed_by);
CREATE INDEX idx_transactions_submitted_by ON transactions (submitted_by);
