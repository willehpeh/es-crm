import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ContactsService } from '../services/contacts.service';
import { registerNewContactSchema } from '../schemas/register-new-contact.schema';
import { ZodPipe } from '../../core/pipes/zod.pipe';
import { RegisterNewContactDto } from '@es-crm/application';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contacts: ContactsService) {}

  @Post()
  @UsePipes(new ZodPipe(registerNewContactSchema))
  async registerNewContact(@Body() dto: RegisterNewContactDto) {
    return this.contacts.registerNewContact(dto);
  }
}
