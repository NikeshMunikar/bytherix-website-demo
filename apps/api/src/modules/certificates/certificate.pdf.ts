import PDFDocument from 'pdfkit'
import type { Writable } from 'stream'

const COLORS = {
  navy:  '#0A1628',
  blue:  '#1452CC',
  green: '#16A34A',
  slate: '#4A5A7A',
  white: '#F8FAFF',
}

interface CertificateData {
  studentName:       string
  courseTitle:       string
  certificateNumber: string
  issuedAt:          Date
  durationHours:     number
}

export function renderCertificatePdf(data: CertificateData, output: Writable): void {
  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 })
  doc.pipe(output)

  const { width, height } = doc.page

  // Background + border
  doc.rect(0, 0, width, height).fill('#FFFFFF')
  doc.lineWidth(3).strokeColor(COLORS.navy).rect(24, 24, width - 48, height - 48).stroke()
  doc.lineWidth(1).strokeColor(COLORS.blue).rect(34, 34, width - 68, height - 68).stroke()

  // Wordmark
  doc.fontSize(20).fillColor(COLORS.navy).font('Helvetica-Bold')
    .text('By', 0, 70, { align: 'center', continued: true })
  doc.fillColor(COLORS.blue).text('the', { continued: true })
  doc.fillColor(COLORS.green).text('rix')

  // Title
  doc.fontSize(36).fillColor(COLORS.navy).font('Helvetica-Bold')
    .text('Certificate of Completion', 0, 130, { align: 'center' })

  doc.fontSize(13).fillColor(COLORS.slate).font('Helvetica')
    .text('This certificate is proudly presented to', 0, 190, { align: 'center' })

  doc.fontSize(30).fillColor(COLORS.blue).font('Helvetica-Bold')
    .text(data.studentName, 0, 220, { align: 'center' })

  doc.fontSize(13).fillColor(COLORS.slate).font('Helvetica')
    .text('for successfully completing the course', 0, 270, { align: 'center' })

  doc.fontSize(20).fillColor(COLORS.navy).font('Helvetica-Bold')
    .text(data.courseTitle, 60, 300, { align: 'center', width: width - 120 })

  doc.fontSize(11).fillColor(COLORS.slate).font('Helvetica')
    .text(`${data.durationHours} hours of instruction`, 0, 345, { align: 'center' })

  // Footer: date + certificate number
  const footerY = height - 100
  doc.fontSize(10).fillColor(COLORS.slate)
    .text(`Issued on ${data.issuedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 80, footerY, { align: 'left' })
  doc.text(`Certificate No. ${data.certificateNumber}`, -80, footerY, { align: 'right', width: width })
  doc.text('Verify at bytherix.com/certificates/verify', 0, footerY + 16, { align: 'center' })

  doc.end()
}
