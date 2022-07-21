/* GLOBAL MODULES */
import { SetMetadata } from '@nestjs/common';

// Create @Public decorator - used to set public property
export const Public = () => SetMetadata('isPublic', true);
