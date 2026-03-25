import { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '@/components/PageWrapper';
import SectionCard from '@/components/SectionCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Heart } from 'lucide-react';
import { toast } from 'sonner';

const Feedback = () => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [feedback, setFeedback] = useState('');
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city || !state || !country || !feedback) { 
      toast.error('Please fill all fields'); 
      return; 
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/viewer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, state, country, feedback, liked }),
      });
      if (res.ok) {
        toast.success('Feedback submitted!');
        setName(''); setCity(''); setState(''); setCountry(''); setFeedback(''); setLiked(false);
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Error submitting feedback');
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Share Your Feedback</h1>
          <p className="text-lg text-muted-foreground">
            Help us improve by sharing your thoughts on global income inequality data
          </p>
        </div>

        <SectionCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Your state or province"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Your country"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="feedback">Feedback *</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts about the global income inequality data..."
                rows={4}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="liked"
                checked={liked}
                onChange={(e) => setLiked(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="liked" className="flex items-center gap-2 cursor-pointer">
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                I like this project
              </Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Submitting...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </SectionCard>
      </motion.div>
    </PageWrapper>
};

export default Feedback;
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
=======
>>>>>>> 70f02c7 (Fixed server folder and added backend)
      </section>
    </PageWrapper>
  );
};

export default Feedback;
