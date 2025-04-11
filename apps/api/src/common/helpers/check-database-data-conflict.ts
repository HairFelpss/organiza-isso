import { ConflictException } from '@nestjs/common';

type ConflictCheck<T = unknown> = {
  check: Promise<T | null | undefined>;
  message: string;
};

export async function checkDatabaseDataConflict<T = unknown>(
  checks: ConflictCheck<T>[],
): Promise<void> {
  const results = await Promise.all(checks.map((c) => c.check));

  results.forEach((result, i) => {
    if (result) {
      throw new ConflictException(checks[i].message);
    }
  });
}
