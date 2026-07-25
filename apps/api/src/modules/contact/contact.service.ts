import { ContactMessage, type IContactMessage } from './contact.model'
import { logger }                                from '../../config/logger'
import { emailService }                          from '../email/email.service'

type SubmitInput = Pick<IContactMessage, 'name' | 'email' | 'subject' | 'message' | 'type'>

export class ContactService {
  async submit(data: SubmitInput) {
    const record = await ContactMessage.create(data)
    await emailService.notifyTeamOfContactMessage(data)
    logger.info({ contactId: record._id, email: data.email, type: data.type }, 'Contact message received')
    return record
  }
}

export const contactService = new ContactService()
