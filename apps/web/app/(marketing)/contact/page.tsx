import type { Metadata } from 'next'
import { ContactForm } from '@/components/common/ContactForm'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Bytherix for courses, project quotes, or support.',
  alternates: { canonical: 'https://bytherix.com/contact' },
}

const info = [
  { icon: Mail,   label: 'Email',   value: 'hello@bytherix.com', href: 'mailto:hello@bytherix.com' },
  { icon: Phone,  label: 'Phone',   value: '+977 980-000-0000',  href: 'tel:+9779800000000' },
  { icon: MapPin, label: 'Address', value: 'Kathmandu, Nepal',   href: null },
  { icon: Clock,  label: 'Hours',   value: 'Mon–Sat, 9am–6pm',  href: null },
]

export default function ContactPage() {
  return (
    <div className="pt-28 pb-20 bg-bx-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-mono font-semibold text-bx-blue uppercase tracking-[0.2em] mb-3">Get In Touch</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-bx-white mb-4">Let's build something great</h1>
          <p className="text-bx-slate max-w-lg mx-auto">Have a project in mind or want to enroll? We'd love to hear from you.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {info.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="bx-card p-5 flex items-start gap-4 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-bx-blue/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-bx-blue" />
                </div>
                <div>
                  <p className="text-bx-muted text-xs uppercase tracking-wider mb-0.5">{label}</p>
                  {href
                    ? <a href={href} className="text-bx-white text-sm font-medium hover:text-bx-blue-light transition-colors">{value}</a>
                    : <p className="text-bx-white text-sm font-medium">{value}</p>}
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3 bx-card p-8 rounded-2xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}