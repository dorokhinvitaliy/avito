import axios from 'axios';
import { OLLAMA_BASE_URL, OLLAMA_MODEL } from '../../../shared/config/constants';
import type { Item, ItemCategory, ItemParams } from '../../../entities/ad';
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
    ? `Ты — AI-ассистент для продавцов на маркетплейсе. Улучши описание объявления, сделай его более привлекательным и информативным. Сохрани ключевую информацию, добавь структуру. Отвечай ТОЛЬКО текстом описания, без пояснений.

Информация о товаре:
${context}`
    : `Ты — AI-ассистент для продавцов на маркетплейсе. Придумай привлекательное и информативное описание для объявления. Отвечай ТОЛЬКО текстом описания, без пояснений.

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

  const prompt = `Ты — AI-ассистент для оценки рыночной стоимости товаров. На основании следующей информации предложи актуальную рыночную цену. Дай краткий ответ с диапазоном цен и пояснениями. Отвечай на русском.

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
