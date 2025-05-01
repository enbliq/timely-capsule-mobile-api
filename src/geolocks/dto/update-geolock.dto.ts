import { PartialType } from '@nestjs/mapped-types';
import { CreateGeolockDto } from './create-geolock.dto';

export class UpdateGeolockDto extends PartialType(CreateGeolockDto) {}
