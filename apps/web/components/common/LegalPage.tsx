export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <div className="pt-28 pb-20 bg-bx-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-bx-white mb-2">{title}</h1>
        <p className="text-bx-muted text-sm mb-10">Last updated: {updated}</p>
        <div className="space-y-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-bx-white [&_h2]:mb-3 [&_h2]:mt-8
                        [&_p]:text-bx-slate [&_p]:leading-relaxed [&_p]:mb-3
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-bx-slate [&_ul]:space-y-1.5 [&_ul]:mb-3
                        [&_a]:text-bx-blue-light [&_a]:hover:text-bx-blue [&_strong]:text-bx-white">
          {children}
        </div>
      </div>
    </div>
  )
}
