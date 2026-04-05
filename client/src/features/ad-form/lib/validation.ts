
export interface FormErrors {
  title?: string;
  price?: string;
}

export interface ValidationData {
  title: string;
  price: string | number;
}

export function validateForm(data: ValidationData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title || data.title.trim() === '') {
    errors.title = 'Название должно быть заполнено';
  }

  const priceStr = String(data.price).trim();
  if (priceStr === '' || isNaN(Number(priceStr)) || Number(priceStr) < 0) {
    errors.price = 'Цена должна быть заполнена';
  }

  return errors;
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(Boolean);
}
