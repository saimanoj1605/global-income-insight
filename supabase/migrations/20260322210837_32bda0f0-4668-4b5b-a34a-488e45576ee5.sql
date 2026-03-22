
CREATE TABLE public.blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email text NOT NULL DEFAULT '',
  blocked_by uuid NOT NULL,
  blocked_at timestamp with time zone NOT NULL DEFAULT now(),
  reason text DEFAULT '',
  UNIQUE (user_id)
);

ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view blocked users
CREATE POLICY "Admins can view blocked users"
ON public.blocked_users FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert blocked users
CREATE POLICY "Admins can block users"
ON public.blocked_users FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete (unblock) users
CREATE POLICY "Admins can unblock users"
ON public.blocked_users FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Function to check if a user is blocked
CREATE OR REPLACE FUNCTION public.is_user_blocked(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.blocked_users WHERE user_id = _user_id
  )
$$;
