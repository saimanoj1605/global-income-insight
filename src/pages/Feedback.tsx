import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, MessageCircle, Send, ThumbsUp, ThumbsDown, Lightbulb, ExternalLink, Reply } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FeedbackItem {
  id: string;
  rating: number;
  comment: string | null;
  question: string | null;
  created_at: string;
  replies?: { id: string; reply: string; created_at: string }[];
}

interface SuggestionItem {
  id: string;
  suggestion: string;
  created_at: string;
}

const pollQuestions = [
  { key: 'like_website', question: 'Do you like this website?' },
  { key: 'useful_data', question: 'Did you find the data useful for understanding global income inequality?' },
  { key: 'dashboard_helpful', question: 'Was the Power BI dashboard helpful in visualizing the data?' },
  { key: 'recommend', question: 'Would you recommend this project to others?' },
];

const indicatorLinks = [
  { name: 'Gini Index', desc: 'Measures income inequality within a country. A value of 0 represents perfect equality, while 100 implies maximum inequality.', url: 'https://data.worldbank.org/indicator/SI.POV.GINI' },
  { name: 'GDP per Capita', desc: 'Gross Domestic Product divided by total population. Indicates average economic output per person.', url: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD' },
  { name: 'Median Income', desc: 'The income level at which half the population earns more and half earns less.', url: 'https://data.worldbank.org/indicator/SI.SPR.PCAP.ZG' },
  { name: 'Income Share (Top 10%)', desc: 'Percentage of total income held by the richest 10% of the population.', url: 'https://data.worldbank.org/indicator/SI.DST.10TH.10' },
];

const Feedback = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [question, setQuestion] = useState('');
  const [comment, setComment] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [pollAnswers, setPollAnswers] = useState<Record<string, string>>({});
  const [existingPolls, setExistingPolls] = useState<Record<string, string>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFeedback();
    fetchSuggestions();
    fetchPollResponses();
    if (user) {
      supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' }).then(({ data }) => setIsAdmin(!!data));
    }
  }, [user]);

  const fetchFeedback = async () => {
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) {
      // Fetch replies for each feedback
      const feedbackWithReplies = await Promise.all(
        data.map(async (fb) => {
          const { data: replies } = await supabase
            .from('feedback_replies')
            .select('id, reply, created_at')
            .eq('feedback_id', fb.id)
            .order('created_at', { ascending: true });
          return { ...fb, replies: replies || [] };
        })
      );
      setFeedbackList(feedbackWithReplies);
    }
  };

  const fetchSuggestions = async () => {
    const { data } = await supabase.from('suggestions').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setSuggestions(data);
  };

  const fetchPollResponses = async () => {
    if (!user) return;
    const { data } = await supabase.from('poll_responses').select('question_key, answer').eq('user_id', user.id);
    if (data) {
      const map: Record<string, string> = {};
      data.forEach(d => { map[d.question_key] = d.answer; });
      setExistingPolls(map);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    setLoading(true);
    const { error } = await supabase.from('feedback').insert({
      user_id: user?.id,
      rating,
      question: question || null,
      comment: comment || null,
    });
    setLoading(false);
    if (error) { toast.error('Failed to submit feedback'); } else {
      toast.success('Feedback submitted!');
      setRating(0); setQuestion(''); setComment('');
      fetchFeedback();
    }
  };

  const handleSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) { toast.error('Please enter a suggestion'); return; }
    const { error } = await supabase.from('suggestions').insert({ user_id: user?.id, suggestion: suggestion.trim() });
    if (error) toast.error('Failed to submit');
    else { toast.success('Suggestion submitted!'); setSuggestion(''); fetchSuggestions(); }
  };

  const handlePollAnswer = async (key: string, answer: string) => {
    setPollAnswers(prev => ({ ...prev, [key]: answer }));
    const { error } = await supabase.from('poll_responses').upsert(
      { user_id: user?.id!, question_key: key, answer },
      { onConflict: 'user_id,question_key' }
    );
    if (error) toast.error('Failed to save answer');
    else {
      setExistingPolls(prev => ({ ...prev, [key]: answer }));
      toast.success('Answer recorded!');
    }
  };

  const handleReply = async (feedbackId: string) => {
    const text = replyText[feedbackId];
    if (!text?.trim()) { toast.error('Enter a reply'); return; }
    const { error } = await supabase.from('feedback_replies').insert({
      feedback_id: feedbackId,
      reply: text.trim(),
      replied_by: user?.id!,
    });
    if (error) toast.error('Failed to reply');
    else {
      toast.success('Reply posted!');
      setReplyText(prev => ({ ...prev, [feedbackId]: '' }));
      fetchFeedback();
    }
  };

  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Feedback & Community
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg">Share feedback, suggestions, answer polls, and explore indicator resources.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        {/* Submit Feedback */}
        <SectionCard title="Submit Feedback">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-semibold">Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110">
                    <Star size={32} className={`${star <= (hoverRating || rating) ? 'fill-accent text-accent' : 'text-muted-foreground'} transition-colors`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="question">Your Question (optional)</Label>
              <Input id="question" value={question} onChange={e => setQuestion(e.target.value)}
                placeholder="Ask a question about the project..." maxLength={500} />
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea id="comment" value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Share your feedback..." rows={4} maxLength={1000} />
            </div>
            <Button type="submit" disabled={loading} className="gap-2">
              <Send size={16} /> {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </SectionCard>

        {/* Suggestion Box */}
        <SectionCard title="💡 Suggestion Box">
          <p className="text-sm text-muted-foreground mb-4">Have a suggestion for improving this website? We'd love to hear it!</p>
          <form onSubmit={handleSuggestion} className="space-y-4">
            <Textarea value={suggestion} onChange={e => setSuggestion(e.target.value)}
              placeholder="Your suggestion for this website..." rows={3} maxLength={500} />
            <Button type="submit" variant="outline" className="gap-2">
              <Lightbulb size={16} /> Submit Suggestion
            </Button>
          </form>
        </SectionCard>

        {/* Poll Q&A */}
        <SectionCard title="📊 Quick Poll">
          <p className="text-sm text-muted-foreground mb-4">Help us understand your experience — select Yes or No for each question.</p>
          <div className="space-y-4">
            {pollQuestions.map(pq => {
              const current = existingPolls[pq.key] || pollAnswers[pq.key];
              return (
                <div key={pq.key} className="p-4 rounded-lg bg-muted border border-border">
                  <p className="text-sm font-medium text-foreground mb-3">{pq.question}</p>
                  <div className="flex gap-3">
                    <Button size="sm" variant={current === 'yes' ? 'default' : 'outline'}
                      onClick={() => handlePollAnswer(pq.key, 'yes')} className="gap-1"
                      disabled={!!existingPolls[pq.key]}>
                      <ThumbsUp size={14} /> Yes
                    </Button>
                    <Button size="sm" variant={current === 'no' ? 'destructive' : 'outline'}
                      onClick={() => handlePollAnswer(pq.key, 'no')} className="gap-1"
                      disabled={!!existingPolls[pq.key]}>
                      <ThumbsDown size={14} /> No
                    </Button>
                    {existingPolls[pq.key] && (
                      <span className="text-xs text-muted-foreground self-center ml-2">✓ Answered</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Learn about indicators */}
        <SectionCard title="📚 Learn About Indicators">
          <p className="text-sm text-muted-foreground mb-4">
            Want to learn more about the indicators, calculated measures, and calculated columns used in this project? Explore these resources:
          </p>
          <div className="space-y-3">
            {indicatorLinks.map(ind => (
              <div key={ind.name} className="p-4 rounded-lg bg-muted border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground text-sm">{ind.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ind.desc}</p>
                  </div>
                  <a href={ind.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="gap-1 shrink-0">
                      <ExternalLink size={14} /> Read More
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Recent Feedback with replies */}
        {feedbackList.length > 0 && (
          <SectionCard title="Recent Feedback & Q/A">
            <div className="space-y-4">
              {feedbackList.map(fb => (
                <div key={fb.id} className="p-4 rounded-lg bg-muted border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < fb.rating ? 'fill-accent text-accent' : 'text-muted-foreground'} />
                    ))}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {fb.question && (
                    <div className="flex items-start gap-2 mb-1">
                      <MessageCircle size={14} className="text-primary mt-0.5" />
                      <p className="text-sm font-medium text-foreground">{fb.question}</p>
                    </div>
                  )}
                  {fb.comment && <p className="text-sm text-muted-foreground">{fb.comment}</p>}

                  {/* Replies */}
                  {fb.replies && fb.replies.length > 0 && (
                    <div className="mt-3 ml-4 space-y-2 border-l-2 border-primary/20 pl-3">
                      {fb.replies.map(r => (
                        <div key={r.id} className="text-sm">
                          <span className="text-xs font-semibold text-primary">Admin Reply</span>
                          <p className="text-foreground">{r.reply}</p>
                          <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Admin reply form */}
                  {isAdmin && (
                    <div className="mt-3 flex gap-2">
                      <Input
                        value={replyText[fb.id] || ''}
                        onChange={e => setReplyText(prev => ({ ...prev, [fb.id]: e.target.value }))}
                        placeholder="Reply to this feedback..."
                        className="text-sm"
                      />
                      <Button size="sm" onClick={() => handleReply(fb.id)} className="gap-1 shrink-0">
                        <Reply size={14} /> Reply
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Recent Suggestions */}
        {suggestions.length > 0 && (
          <SectionCard title="Recent Suggestions">
            <div className="space-y-3">
              {suggestions.map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-muted border border-border flex items-start gap-2">
                  <Lightbulb size={16} className="text-accent mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{s.suggestion}</p>
                    <span className="text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </section>
    </PageWrapper>
  );
};

export default Feedback;
