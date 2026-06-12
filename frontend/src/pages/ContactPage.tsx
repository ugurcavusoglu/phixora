import { useState } from 'react';
import api from '../api/client';

const FAQ = [
  {
    q: 'Is phiXora free to use?',
    a: 'Yes, phiXora is free during our beta period.',
  },
  {
    q: 'What image formats are supported?',
    a: 'We support PNG, JPG, JPEG, and WEBP. Maximum file size is 20 MB.',
  },
  {
    q: 'Are my images stored?',
    a: 'Processed images are saved to your history so you can redownload them. You can delete them anytime.',
  },
];

const inputClass =
  'w-full px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#4F6BED] focus:ring-2 focus:ring-[#4F6BED]/10 transition-colors duration-200';

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
    <div className="min-h-screen bg-[#F7F9FC]">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#E0E7FF_0%,#F7F9FC_65%)] pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-5xl font-black text-[#111827] mb-4">Contact Us</h1>
          <p className="text-[#6B7280] text-lg">Have a question or feedback? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-8 px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">

          {/* Contact form */}
          <div className="p-8 rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(79,107,237,0.06)]">
            <h2 className="text-xl font-bold text-[#111827] mb-6">Send a Message</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#EEF4FF] border border-[#4F6BED]/30 flex items-center justify-center text-3xl text-[#4F6BED] mb-4">✓</div>
                <h3 className="text-[#111827] font-semibold text-lg mb-2">Message Sent!</h3>
                <p className="text-[#6B7280] text-sm">We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] hover:border-[#4F6BED] text-sm transition-all duration-200"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {status === 'error' && (
                  <div className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    Something went wrong. Please try again.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#374151] mb-1">Email *</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Subject *</label>
                  <input name="subject" value={form.subject} onChange={handleChange} required placeholder="What is it about?" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Your message…" className={`${inputClass} resize-none`} />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-2.5 rounded-lg bg-[#4F6BED] hover:bg-[#3F56C6] text-white font-semibold transition-all duration-200 disabled:opacity-50 shadow-sm"
                >
                  {status === 'loading' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-xl font-bold text-[#111827] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ.map((item, i) => (
                <div key={i} className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-[#111827] text-sm font-medium hover:text-[#4F6BED] transition-colors duration-200"
                  >
                    {item.q}
                    <span className="text-[#9CA3AF] ml-2 text-lg leading-none">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-sm text-[#6B7280] leading-relaxed border-t border-[#E5E7EB] pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 rounded-xl border border-[#E5E7EB] bg-[#EEF4FF]">
              <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-2">Project</p>
              <p className="text-[#111827] font-medium">CENG318 — Group 10</p>
              <p className="text-[#6B7280] text-sm mt-1">Human-Computer Interaction</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E5E7EB] bg-white py-8 px-6 flex items-center justify-between text-[#6B7280] text-sm">
        <span><span className="text-[#4F6BED]">◇</span> phiXora</span>
        <span>CENG318 — Group 10</span>
      </footer>
    </div>
  );
}
