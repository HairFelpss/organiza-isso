import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Schema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: Schema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (result.success) {
      // TypeScript infere corretamente que `result` é SafeParseSuccess<T>
      return result.data;
    }

    throw new BadRequestException(result.error.format());
  }
}
