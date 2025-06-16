import { PartialType } from '@nestjs/mapped-types';
import { CreateCentralDto } from './create-central.dto';

export class UpdateCentralDto extends PartialType(CreateCentralDto) {}
