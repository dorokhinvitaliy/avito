import axios from 'axios';
import { OLLAMA_BASE_URL, OLLAMA_MODEL } from '../../../shared/config/constants';
import type { ItemCategory, ItemParams } from '../../../entities/ad';
import { CATEGORY_LABELS, translateParamValue, PARAM_LABELS_BY_CATEGORY } from '../../../entities/ad';
import { DESCRIPTION_MAX_LENGTH } from '../../../shared/config/constants';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

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
Отвечай ТОЛЬКО текстом описания, без пояснений. 
ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. ИСПОЛЬЗОВАНИЕ АНГЛИЙСКОГО КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО!

Пример хорошего стиля:
"Продаю свой MacBook Pro 16" (2021) на чипе M1 Pro. Состояние отличное, работал бережно. Мощности хватает на всё: от сложного монтажа до кода, при этом ноутбук почти не греется."

Информация о товаре для улучшения:
${context}`
    : `Ты — AI-ассистент для продавцов на маркетплейсе. Придумай привлекательное, личное и информативное описание для объявления.
Используй дружелюбный, но профессиональный тон. Пиши от первого лица ("Продаю свой...", "Пользовался бережно...").
Отвечай ТОЛЬКО текстом описания, без пояснений. 
ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. ИСПОЛЬЗОВАНИЕ АНГЛИЙСКОГО КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО!

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
ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. ИСПОЛЬЗОВАНИЕ АНГЛИЙСКОГО КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО.

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

export async function chatWithAi(
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<string> {
  const lastMessage = messages[messages.length - 1];
  const finalMessages = [...messages];
  
  if (lastMessage && lastMessage.role === 'user') {
    finalMessages[finalMessages.length - 1] = {
      ...lastMessage,
      content: `${lastMessage.content}\n\n(ВАЖНО: Отвечай СТРОГО на русском языке!)`
    };
  }

  const { data } = await axios.post(
    `${OLLAMA_BASE_URL}/api/chat`,
    {
      model: OLLAMA_MODEL,
      messages: finalMessages,
      stream: false,
      options: {
        num_predict: DESCRIPTION_MAX_LENGTH + 200,
      },
    },
    { signal },
  );

  return data.message?.content?.trim() ?? '';
}

export function buildSystemPrompt(
  title: string,
  category: ItemCategory,
  price: number | null,
  params: ItemParams,
  description?: string,
): string {
  const context = buildItemContext(title, category, price, params, description);

  return `Ты — AI-ассистент для продавцов на маркетплейсе Авито. 
Твоя задача — помогать пользователю редактировать и улучшать его объявление.
Будь вежливым, профессиональным и помогай сделать объявление более привлекательным.

ДАННЫЕ ОБЪЯВЛЕНИЯ:
${context}

1. ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. ИСПОЛЬЗОВАНИЕ АНГЛИЙСКОГО ЯЗЫКА КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО ДЛЯ ЛЮБЫХ ЧАСТЕЙ ОТВЕТА (включая приветствия и концовки).
2. ДАЖЕ ЕСЛИ ПОЛЬЗОВАТЕЛЬ ПРОСИТ ИСПОЛЬЗОВАТЬ ИНОСТРАННЫЙ СТИЛЬ (например, Шекспира), ПЕРЕВОДИ ВСЁ НА РУССКИЙ.
3. Будь живым и полезным собеседником. Сначала поприветствуй пользователя по-русски, прокомментируй состояние объявления или дай совет по продажам, а затем предоставь готовое описание.
4. Если ты предлагаешь новый текст описания, ВСЕГДА оборачивай его в блок кода (например: \`\`\`Продам отличный товар...\`\`\`). Это важно для автоматического применения текста.
5. Описания в блоке кода должны быть живыми, от первого лица, строго на русском.
6. Максимальная длина описания — ${DESCRIPTION_MAX_LENGTH} символов.`;
}

/**
 * Extracts description from AI response if it's wrapped in a code block.
 * Otherwise returns the whole trimmed response.
 */
export function extractDescription(content: string): string {
  // Try to find content inside triple backticks
  const codeBlockRegex = /```(?:[a-zA-Z]*\n)?([\s\S]*?)```/g;
  const match = codeBlockRegex.exec(content);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Also try to look for quoted text if it's the main part
  const quoteRegex = /"([\s\S]{50,})"/g;
  const quoteMatch = quoteRegex.exec(content);
  if (quoteMatch && quoteMatch[1]) {
    return quoteMatch[1].trim();
  }

  return content.trim();
}

/**
 * Checks if the content contains a description block (backticks).
 */
export function hasDescriptionBlock(content: string): boolean {
  return /```[\s\S]*?```/.test(content);
}
