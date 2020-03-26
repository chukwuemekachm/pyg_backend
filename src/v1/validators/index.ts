import { validate } from 'class-validator';

export async function validateRequest(
  Validator: any,
  payload: Record<string, any>,
  isUpdate = false,
): Promise<boolean | Record<string, string[]>> {
  const resource = new Validator(payload);
  let validationErrors = {};

  Object.entries(payload).forEach(([key, value]) => {
    resource[key] = typeof value === 'string' ? value.replace(/  +/g, '').trim() : value;
  });

  const errors = await validate(resource, {
    validationError: { target: false },
    skipMissingProperties: isUpdate,
  });

  if (errors.length === 0) {
    return false;
  }

  for (const error of errors) {
    validationErrors = {
      ...validationErrors,
      [error.property]: Object.entries(error.constraints).map(([, value]) => value),
    };
  }

  return validationErrors;
}
