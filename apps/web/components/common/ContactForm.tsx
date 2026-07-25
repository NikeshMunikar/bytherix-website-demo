'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { apiClient } from '@/lib/api-client'

const schema = z.object({
  name:    z.string().min(2, 'Name is required'),
  email:   z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  type:    z.enum(['general', 'course', 'project', 'quote']),
})
type F = z.infer<typeof schema>

export function ContactForm() {
  const [ok, setOk] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'general' },
  })

  const onSubmit = async (data: F) => {
    setServerError(null)
    try {
      await apiClient.post('/contact', data)
      setOk(true)
    } catch (err) {
      const message = isAxiosError(err) ? err.response?.data?.error : undefined
      const finalMessage = message ?? 'Something went wrong. Please try again.'
      setServerError(finalMessage)
      toast.error(finalMessage)
    }
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-bx-navy border border-bx-border text-bx-white placeholder:text-bx-muted text-sm focus:outline-none focus:border-bx-blue transition-colors"
  const labelClass = "block text-bx-slate text-sm font-medium mb-1.5"

  if (ok) return (
    <div className="text-center py-12">
      <CheckCircle className="w-14 h-14 text-bx-green mx-auto mb-4" />
      <h3 className="text-xl font-bold text-bx-white mb-2">Message sent!</h3>
      <p className="text-bx-slate text-sm">We&apos;ll get back to you within 24 hours.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className={labelClass}>Your name</label>
          <input id="name" type="text" {...register('name')} className={inputClass} placeholder="John Doe" />
          {errors.name && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>Email address</label>
          <input id="contact-email" type="email" {...register('email')} className={inputClass} placeholder="you@example.com" />
          {errors.email && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="type" className={labelClass}>Inquiry type</label>
        <select id="type" {...register('type')} className={inputClass}>
          <option value="general">General Inquiry</option>
          <option value="course">Course Enrollment</option>
          <option value="project">Project Request</option>
          <option value="quote">Request a Quote</option>
        </select>
      </div>

      <div>
        <label htmlFor="subject" className={labelClass}>Subject</label>
        <input id="subject" type="text" {...register('subject')} className={inputClass} placeholder="How can we help?" />
        {errors.subject && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.subject.message}</p>}
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea id="message" rows={5} {...register('message')} className={inputClass + ' resize-none'} placeholder="Tell us about your project or question..." />
        {errors.message && <p role="alert" className="mt-1 text-xs text-bx-red">{errors.message.message}</p>}
      </div>

      {serverError && (
        <p role="alert" className="flex items-center gap-2 text-sm text-bx-red">
          <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting}
        className="w-full py-3 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}