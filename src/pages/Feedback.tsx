import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface FeedbackItem {
  id: string;
  rating: number;
  comment: string | null;
  question: string | null;
  created_at: string;
}

const Feedback = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [question, setQuestion] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setFeedbackList(data);
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

  return (
    <PageWrapper>
      <section className="gradient-hero py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Feedback
          </motion.h1>
          <p className="text-primary-foreground/80 text-lg">Share your thoughts, questions, and ratings about the project.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        <SectionCard title="Submit Feedback">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <Label className="text-base font-semibold">Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= (hoverRating || rating)
                          ? 'fill-accent text-accent'
                          : 'text-muted-foreground'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Question */}
            <div>
              <Label htmlFor="question">Your Question (optional)</Label>
              <Input
                id="question"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask a question about the project..."
                maxLength={500}
              />
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your feedback..."
                rows={4}
                maxLength={1000}
              />
            </div>

            <Button type="submit" disabled={loading} className="gap-2">
              <Send size={16} /> {loading ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </SectionCard>

        {/* Feedback list */}
        {feedbackList.length > 0 && (
          <SectionCard title="Recent Feedback">
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
