import type { ItemCategory } from '../model/types';

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  auto: 'Авто',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
};

export const AUTO_PARAM_LABELS: Record<string, string> = {
  brand: 'Бренд',
  model: 'Модель',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег',
  enginePower: 'Мощность двигателя',
};

export const REAL_ESTATE_PARAM_LABELS: Record<string, string> = {
  type: 'Тип',
  address: 'Адрес',
  area: 'Площадь',
  floor: 'Этаж',
};

export const ELECTRONICS_PARAM_LABELS: Record<string, string> = {
  type: 'Тип',
  brand: 'Бренд',
  model: 'Модель',
  condition: 'Состояние',
  color: 'Цвет',
};

export const PARAM_LABELS_BY_CATEGORY: Record<ItemCategory, Record<string, string>> = {
  auto: AUTO_PARAM_LABELS,
  real_estate: REAL_ESTATE_PARAM_LABELS,
  electronics: ELECTRONICS_PARAM_LABELS,
};

export const TRANSMISSION_LABELS: Record<string, string> = {
  automatic: 'Автоматическая',
  manual: 'Механическая',
};

export const REAL_ESTATE_TYPE_LABELS: Record<string, string> = {
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
};

export const ELECTRONICS_TYPE_LABELS: Record<string, string> = {
  phone: 'Телефон',
  laptop: 'Ноутбук',
  misc: 'Другое',
};

export const CONDITION_LABELS: Record<string, string> = {
  new: 'Новый',
  used: 'Б/У',
};

export function translateParamValue(category: ItemCategory, key: string, value: unknown): string {
  if (value === undefined || value === null || value === '') return '';

  if (key === 'transmission') return TRANSMISSION_LABELS[String(value)] ?? String(value);
  if (key === 'condition') return CONDITION_LABELS[String(value)] ?? String(value);

  if (key === 'type') {
    if (category === 'real_estate') return REAL_ESTATE_TYPE_LABELS[String(value)] ?? String(value);
    if (category === 'electronics')
      return ELECTRONICS_TYPE_LABELS[String(value)] ?? String(value);
  }

  if (key === 'mileage') return `${Number(value).toLocaleString('ru-RU')} км`;
  if (key === 'enginePower') return `${value} л.с.`;
  if (key === 'area') return `${value} м²`;
  if (key === 'yearOfManufacture') return String(value);
  if (key === 'floor') return `${value}`;

  return String(value);
}

/** All expected parameter keys for each category (used for needsRevision check on client) */
export const EXPECTED_PARAMS: Record<ItemCategory, string[]> = {
  auto: ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'],
  real_estate: ['type', 'address', 'area', 'floor'],
  electronics: ['type', 'brand', 'model', 'condition', 'color'],
};
