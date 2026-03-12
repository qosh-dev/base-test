import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateStringPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!value || typeof value !== 'string') {
      throw new BadRequestException('Value must be a non-empty string');
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new BadRequestException('Value cannot be empty or whitespace only');
    }
    if (trimmed.length > 255) {
      throw new BadRequestException('Value cannot exceed 255 characters');
    }
    if (!/^[a-zA-Z0-9\s\-_.,]+$/.test(trimmed)) {
      throw new BadRequestException('Value contains invalid characters');
    }
    return trimmed;
  }
}
