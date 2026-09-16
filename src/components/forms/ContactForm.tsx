import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    interest: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    const form = e.currentTarget;
    const formData = new FormData(form);
    // Add Netlify form identification
    formData.append('form-name', 'contact');

    // Convert FormData to URLSearchParams
    const searchParams = new URLSearchParams();
    formData.forEach((value, key) => {
      searchParams.append(key, value.toString());
    });

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: searchParams.toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
        setFormData({ name: '', email: '', company: '', interest: '', message: '' });
      } else {
        throw new Error('Submission failed');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const interests = [
    'Universal Cloud Infrastructure',
    'AI Core Intelligence',
    'Quantum Link Security',
    'Custom Enterprise Package',
    'General Inquiry'
  ];

  return (
    <form onSubmit={handleSubmit} noValidate className="contact-form" data-netlify="true" data-netlify-honeypot="bot-field">
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="bot-field" />
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="contact-name">Name</label>
          <input
            type="text"
            id="contact-name"
            name="name"
            placeholder="Your Name"
            required
            aria-required="true"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.name && <span id="name-error" className="error-message" role="alert">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">Email</label>
          <input
            type="email"
            id="contact-email"
            name="email"
            placeholder="email@company.com"
            required
            aria-required="true"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.email && <span id="email-error" className="error-message" role="alert">{errors.email}</span>}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="contact-company">Company</label>
        <input
          type="text"
          id="contact-company"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>
      <div className="form-group">
        <label htmlFor="contact-interest">I&apos;m interested in</label>
        <select
          id="contact-interest"
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          disabled={isSubmitting}
        >
          <option value="" disabled>Select a solution</option>
          {interests.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="contact-message">Message</label>
        <textarea
          rows={5}
          id="contact-message"
          name="message"
          placeholder="Tell us about your project..."
          required
          aria-required="true"
          value={formData.message}
          onChange={handleChange}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          disabled={isSubmitting}
        />
        {errors.message && <span id="message-error" className="error-message" role="alert">{errors.message}</span>}
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', fontSize: '1rem' }}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : submitStatus === 'success' ? '✓ Message Sent!' : 'Initialize Contact →'}
      </button>
      {submitStatus === 'success' && (
        <div className="success-toast" role="status" aria-live="polite">
          Thank you! We&apos;ll be in touch within 24 hours.
        </div>
      )}
    </form>
  );
}