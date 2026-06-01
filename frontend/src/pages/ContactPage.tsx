import { useState } from 'react';
import api from '../api/client';

const FAQ = [
  {
    q: 'Is phiXora free to use?',
    a: 'Yes, phiXora is free during our beta period. Create an account and start enhancing images immediately.',
  },
  {
    q: 'What image formats are supported?',
    a: 'We support PNG, JPG, JPEG, and WEBP. Maximum file size is 10 MB.',
  },
  {
    q: 'How does Super Resolution work?',
    a: 'We use Real-ESRGAN, a state-of-the-art AI model that reconstructs fine details to upscale images 2x or 4x.',
  },
  {
    q: 'Are my images stored?',
    a: 'Processed images are saved to your history so you can redownload them. You can delete them anytime.',
  },
];

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
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#A855F7]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-[#A855F7]/40 bg-[#A855F7]/10 text-[#A855F7] text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] animate-pulse" />
            Get in Touch
          </div>
          <h1 className="text-5xl font-black text-white mb-4">Contact Us</h1>
          <p className="text-[#71717A] text-lg">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-8 px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Contact form */}
          <div className="p-8 rounded-2xl border border-[#1E1E2E] bg-[#12121A]">
            <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#06D6A0]/20 flex items-center justify-center text-3xl mb-4">✓</div>
                <h3 className="text-white font-semibold text-lg mb-2">Message Sent!</h3>
                <p className="text-[#71717A] text-sm">We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 rounded-lg border border-[#1E1E2E] text-[#71717A] hover:text-white hover:border-[#7C3AED]/50 text-sm transition-all"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    Something went wrong. Please try again.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[#71717A] mb-1">Name *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#71717A] mb-1">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-[#71717A] mb-1">Subject *</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is it about?"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#71717A] mb-1">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Your message..."
                    className="w-full px-4 py-2.5 rounded-lg bg-[#0A0A0F] border border-[#1E1E2E] text-white placeholder-[#71717A] focus:outline-none focus:border-[#7C3AED] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-2.5 rounded-lg bg-[#7C3AED] hover:bg-[#A855F7] text-white font-semibold transition-all disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#1E1E2E] bg-[#12121A] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-white text-sm font-medium hover:text-[#A855F7] transition-colors"
                  >
                    {item.q}
                    <span className="text-[#71717A] ml-2">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-[#71717A] leading-relaxed border-t border-[#1E1E2E] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-xl border border-[#1E1E2E] bg-[#12121A]">
              <p className="text-xs font-bold tracking-widest text-[#71717A] uppercase mb-2">Project</p>
              <p className="text-white font-medium">CENG318 — Group 10</p>
              <p className="text-[#71717A] text-sm mt-1">Human-Computer Interaction</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#1E1E2E] py-8 px-6 flex items-center justify-between text-[#71717A] text-sm">
        <span><span className="text-[#A855F7]">◇</span> phiXora</span>
        <span>CENG318 — Group 10</span>
      </footer>
    </div>
  );
}
