'use client'
import { useState } from 'react'
import { toast } from 'sonner'
import { Award, Download, AlertTriangle, Loader2 } from 'lucide-react'
import { useMyCertificates, downloadCertificate } from '@/hooks/useCertificates'

export default function CertificatesPage() {
  const { data: certificates, isLoading, isError } = useMyCertificates()
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleDownload = async (id: string, certificateNumber: string) => {
    setDownloadingId(id)
    try {
      await downloadCertificate(id, `bytherix-certificate-${certificateNumber}.pdf`)
    } catch {
      toast.error('Could not download certificate')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-bx-white">Certificates</h1>
        <p className="text-bx-slate text-sm">Certificates you&apos;ve earned by completing courses.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 2 }).map((_, i) => <div key={i} className="bx-card rounded-2xl h-20 animate-pulse" />)}</div>
      ) : isError ? (
        <div className="bx-card rounded-2xl p-10 text-center">
          <AlertTriangle className="w-6 h-6 text-bx-red mx-auto mb-2" />
          <p className="text-bx-slate text-sm">Couldn&apos;t load your certificates.</p>
        </div>
      ) : !certificates || certificates.length === 0 ? (
        <div className="bx-card rounded-2xl p-10 text-center">
          <Award className="w-8 h-8 text-bx-muted mx-auto mb-3" />
          <p className="text-bx-white font-medium mb-1">No certificates yet</p>
          <p className="text-bx-slate text-sm">Complete a course to earn your first certificate.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div key={cert._id} className="bx-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-bx-amber/15 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-bx-amber" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-bx-white font-semibold text-sm truncate">{cert.course.title}</p>
                <p className="text-bx-muted text-xs">
                  {cert.certificateNumber} · Issued {new Date(cert.issuedAt).toLocaleDateString()}
                </p>
              </div>
              <button onClick={() => handleDownload(cert._id, cert.certificateNumber)} disabled={downloadingId === cert._id}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-bx-blue hover:bg-bx-blue-light text-white text-sm font-semibold transition-colors disabled:opacity-50">
                {downloadingId === cert._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
