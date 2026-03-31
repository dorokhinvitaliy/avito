import type { ItemUpdatePayload } from '../../../entities/ad';

export interface FormErrors {
  title?: string;
  price?: string;
}

export function validateForm(data: ItemUpdatePayload): FormErrors {
  const errors: FormErrors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Название должно быть заполнено';
  }

  if (data.price === undefined || data.price === null || isNaN(data.price) || data.price < 0) {
    errors.price = 'Цена должна быть заполнена';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
