-- ============================================================
-- Auth Trigger: Link auth.users to members on signup
--
-- When a user signs up, find their members row by email
-- and set auth_user_id. This is how RLS knows who they are.
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE members
  SET auth_user_id = NEW.id
  WHERE email = LOWER(NEW.email)
    AND auth_user_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
