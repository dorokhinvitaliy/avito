import axios from 'axios';
import { OLLAMA_BASE_URL, OLLAMA_MODEL } from '../../../shared/config/constants';
import type { ItemCategory, ItemParams } from '../../../entities/ad';
import { CATEGORY_LABELS, translateParamValue, PARAM_LABELS_BY_CATEGORY } from '../../../entities/ad';

function buildItemContext(
  title: string,
  category: ItemCategory,
  price: number | null,
  params: ItemParams,
  description?: string,
): string {
  const labels = PARAM_LABELS_BY_CATEGORY[category];
  const paramLines = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => `${labels[key] ?? key}: ${translateParamValue(category, key, value)}`)
    .join('\n');

  return [
    `Категория: ${CATEGORY_LABELS[category]}`,
    `Название: ${title}`,
    price !== null ? `Текущая цена: ${price} руб.` : '',
    paramLines ? `Характеристики:\n${paramLines}` : '',
    description ? `Текущее описание: ${description}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function generateDescription(
  title: string,
  category: ItemCategory,
  price: number | null,
  params: ItemParams,
  currentDescription?: string,
  signal?: AbortSignal,
): Promise<string> {
  const context = buildItemContext(title, category, price, params, currentDescription);

  const prompt = currentDescription
    ? `Ты — AI-ассистент для продавцов на маркетплейсе. Улучши описание объявления, сделай его более привлекательным, личным и информативным. 
Используй дружелюбный, но профессиональный тон. Пиши от первого лица ("Продаю свой...", "Пользовался бережно...").
Отвечай ТОЛЬКО текстом описания, без пояснений. ОТВЕЧАЙ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ.

Пример хорошего стиля:
"Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется."

Информация о товаре для улучшения:
${context}`
    : `Ты — AI-ассистент для продавцов на маркетплейсе. Придумай привлекательное, личное и информативное описание для объявления.
Используй дружелюбный, но профессиональный тон. Пиши от первого лица ("Продаю свой...", "Пользовался бережно...").
Отвечай ТОЛЬКО текстом описания, без пояснений. ОТВЕЧАЙ ТОЛЬКО НА РУССКОМ ЯЗЫКЕ.

Пример хорошего стиля:
"Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется."

Информация о товаре:
${context}`;

  const { data } = await axios.post(
    `${OLLAMA_BASE_URL}/api/generate`,
    {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    },
    { signal },
  );

  return data.response?.trim() ?? '';
}

export async function suggestMarketPrice(
  title: string,
  category: ItemCategory,
  params: ItemParams,
  signal?: AbortSignal,
): Promise<string> {
  const context = buildItemContext(title, category, null, params);

  const prompt = `Ты — AI-ассистент для оценки рыночной стоимости товаров. На основании предоставленной информации предложи актуальную рыночную цену. 
ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ.

СТРУКТУРА ОТВЕТА:
1. На первой строке напиши ТОЛЬКО рекомендуемую цену (одним числом без валюты и пробелов).
2. Со следующей строки напиши краткий обзор цен в зависимости от состояния, используя следующий стиль:

Пример ответа:
125000
Средняя цена на MacBook Pro 16" M1 Pro (16/512GB):
115 000 – 135 000 ₽ — отличное состояние.
От 140 000 ₽ — идеал, малый износ АКБ.
90 000 – 110 000 ₽ — срочно или с дефектами.

Информация о товаре для оценки:
${context}`;

  const { data } = await axios.post(
    `${OLLAMA_BASE_URL}/api/generate`,
    {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    },
    { signal },
  );

  return data.response?.trim() ?? '';
}
