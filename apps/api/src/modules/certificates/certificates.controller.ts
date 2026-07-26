import type { Request, Response, NextFunction } from 'express'
import { certificatesService }                    from './certificates.service'
import { renderCertificatePdf }                   from './certificate.pdf'

type Handler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const wrap = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const certificatesController = {
  listMine: wrap(async (req, res) => {
    const certificates = await certificatesService.listForUser(req.user!._id as never)
    res.json({ success: true, data: certificates })
  }),

  download: wrap(async (req, res) => {
    const certificate = await certificatesService.getForDownload(req.params.id as string, req.user!._id as never, req.user!.role)
    const user   = certificate.user as unknown as { firstName: string; lastName: string }
    const course = certificate.course as unknown as { title: string; duration: number }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="bytherix-certificate-${certificate.certificateNumber}.pdf"`)

    renderCertificatePdf({
      studentName:       `${user.firstName} ${user.lastName}`,
      courseTitle:       course.title,
      certificateNumber: certificate.certificateNumber,
      issuedAt:          certificate.issuedAt,
      durationHours:     course.duration,
    }, res)
  }),

  verify: wrap(async (req, res) => {
    const certificate = await certificatesService.verify(req.params.certificateNumber as string)
    const user   = certificate.user as unknown as { firstName: string; lastName: string }
    const course = certificate.course as unknown as { title: string }

    res.json({
      success: true,
      data: {
        valid:             true,
        studentName:       `${user.firstName} ${user.lastName}`,
        courseTitle:       course.title,
        certificateNumber: certificate.certificateNumber,
        issuedAt:          certificate.issuedAt,
      },
    })
  }),
}
