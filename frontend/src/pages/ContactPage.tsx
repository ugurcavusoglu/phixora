import { useState } from 'react';
import api from '../api/client';

const FAQ = [
  {
    q: 'What is phiXora?',
    a: 'phiXora is a web-based AI image editing tool. You upload a photo, pick an enhancement (super resolution, noise removal, or background removal), and the AI processes it in seconds. No Photoshop skills needed.',
  },
  {
    q: 'Which image formats and sizes are supported?',
    a: 'You can upload PNG, JPG, JPEG, and WEBP files up to 20 MB. Results are always exported in full quality.',
  },
  {
    q: 'How does the AI processing work?',
    a: 'We use state-of-the-art models like Real-ESRGAN for upscaling and rembg for background removal, hosted via Replicate. Your image is sent securely to the AI, processed, and the result is returned — typically in under 30 seconds.',
  },
  {
    q: 'Can I try it without creating an account?',
    a: 'Yes! Click "Try as Guest" on the login page. You can experiment with our sample images to see the tools in action before signing up.',
  },
  {
    q: 'Where are my processed images stored?',
    a: 'All results are saved to your personal history. You can view, re-download, or delete them anytime from the History page. Nothing is shared publicly.',
  },
  {
    q: 'How does pricing work?',
    a: 'phiXora uses a credit system. Each AI tool costs a few credits (3–5 per use). You can purchase credit packages starting at $1.99 for 50 credits. You can also earn free credits by inviting friends — 10 credits per referral, up to 100 credits total.',
  },
];

const inputClass =
  'w-full px-4 py-2.5 rounded-lg bg-[var(--th-input-bg)] border border-border text-text placeholder-subtle focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-colors duration-200';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-bg">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'var(--th-hero-grad)' }} />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black text-text mb-4">Contact Us</h1>
          <p className="text-muted text-lg">Have a question or feedback? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-8 px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact form */}
          <div className="p-8 rounded-2xl border border-accent/20 bg-surface" style={{ boxShadow: '0 4px 24px var(--th-card-glow)' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent text-lg">✉</div>
              <h2 className="text-xl font-bold text-text">Send a Message</h2>
            </div>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl text-black mb-4" style={{ background: 'linear-gradient(135deg, #34D399, #38BDF8)' }}>✓</div>
                <h3 className="text-text font-semibold text-lg mb-2">Message Sent!</h3>
                <p className="text-muted text-sm">We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 rounded-lg border border-border text-muted hover:text-text hover:border-accent text-sm transition-all duration-200"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: 'var(--th-error-bg)', borderWidth: '1px', borderColor: 'var(--th-error-border)', color: 'var(--th-error-text)' }}>
                    Something went wrong. Please try again.
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Subject *</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required placeholder="What is it about?" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Your message…" className={`${inputClass} resize-none`} />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, var(--th-accent), var(--th-sky))' }}
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky/15 flex items-center justify-center text-sky text-lg">?</div>
              <h2 className="text-xl font-bold text-text">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {FAQ.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                      isOpen ? 'border-accent/30 bg-surface' : 'border-border bg-surface hover:border-accent/20'
                    }`}
                    style={isOpen ? { boxShadow: '0 2px 12px var(--th-card-glow)' } : undefined}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium transition-colors duration-200"
                    >
                      <span className={isOpen ? 'text-accent' : 'text-text'}>{item.q}</span>
                      <span className={`text-lg leading-none transition-transform duration-200 ${isOpen ? 'text-accent rotate-45' : 'text-subtle'}`}>+</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-text/80 leading-relaxed border-t border-border pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-surface py-8 px-6 flex items-center justify-end text-muted text-sm">
        <span>© 2026 phiXora</span>
      </footer>
    </div>
  );
}
