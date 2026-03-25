
-- Add suggestions table
CREATE TABLE public.suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  suggestion text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can insert suggestions"
  ON public.suggestions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone authenticated can view suggestions"
  ON public.suggestions FOR SELECT TO authenticated
  USING (true);

-- Add feedback_replies table for admin replies
CREATE TABLE public.feedback_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid REFERENCES public.feedback(id) ON DELETE CASCADE NOT NULL,
  reply text NOT NULL,
  replied_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.feedback_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can insert replies"
  ON public.feedback_replies FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone authenticated can view replies"
  ON public.feedback_replies FOR SELECT TO authenticated
  USING (true);

-- Add poll_responses table for yes/no Q&A
CREATE TABLE public.poll_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_key text NOT NULL,
  answer text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, question_key)
);

ALTER TABLE public.poll_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can insert poll response"
  ON public.poll_responses FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone authenticated can view poll responses"
  ON public.poll_responses FOR SELECT TO authenticated
  USING (true);

-- Allow realtime for feedback_replies and suggestions
ALTER PUBLICATION supabase_realtime ADD TABLE public.feedback_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suggestions;
