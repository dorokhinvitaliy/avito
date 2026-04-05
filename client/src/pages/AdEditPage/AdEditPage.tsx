import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchItem,
  updateItem,
  CATEGORY_LABELS,
  type ItemCategory,
  type ItemParams,
  type ItemUpdatePayload,
} from '@/entities/ad';
import {
  CategoryFields,
  useDraftStorage,
  validateForm,
  hasErrors,
  type FormErrors,
} from '@/features/ad-form';
import { AiDescriptionButton, AiPriceButton, AiChatAside } from '@/features/ai-assistant';
import { ModifiedBadge } from '@/shared/ui/ModifiedBadge';
import { Button, DiffModal } from '@/shared/ui';
import { Input } from '@/shared/ui/Input';
import { Select } from '@/shared/ui/Select';
import { Textarea } from '@/shared/ui/Textarea';
import { Skeleton } from '@/shared/ui/Skeleton';
import { ErrorBlock } from '@/shared/ui/ErrorBlock';
import { useToast } from '@/shared/ui/Toast';
import { DESCRIPTION_MAX_LENGTH } from '@/shared/config/constants';
import { Save, Sparkles } from 'lucide-react';
import styles from './AdEditPage.module.css';
import { BackLink, Flex, Grid, Stack, Typography } from '@/shared/ui';

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

interface FormState {
  category: ItemCategory;
  title: string;
  description: string;
  price: string;
  params: ItemParams;
}

export function AdEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const numericId = Number(id);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasDraftRestored, setHasDraftRestored] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);

  const {
    data: item,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['item', numericId],
    queryFn: ({ signal }) => fetchItem(numericId, signal),
    enabled: !isNaN(numericId),
  });

  const handleDraftRestore = useCallback((draft: FormState) => {
    setForm(draft);
    setHasDraftRestored(true);
  }, []);

  const { saveDraft, clearDraft, hasDraft, isReady } = useDraftStorage<FormState>(
    numericId,
    form,
    handleDraftRestore,
  );

  if (item && form === null && !hasDraftRestored && isReady && !hasDraft()) {
    setForm({
      category: item.category,
      title: item.title,
      description: item.description ?? '',
      price: item.price !== null ? String(item.price) : '',
      params: { ...item.params },
    });
  }

  useEffect(() => {
    if (form) {
      saveDraft(form);
    }
  }, [form, saveDraft]);

  const mutation = useMutation({
    mutationFn: (payload: ItemUpdatePayload) => updateItem(numericId, payload),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['item', numericId] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
      showToast('success', 'Изменения сохранены');
      navigate(`/ads/${numericId}`);
    },
    onError: () => {
      showToast(
        'error',
        'Ошибка сохранения',
        'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const payload: ItemUpdatePayload = {
      category: form.category,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      price: Number(form.price),
      params: form.params,
    };

    const formErrors = validateForm({ title: form.title, price: form.price });
    setErrors(formErrors);

    if (hasErrors(formErrors)) {
      setTouched({ title: true, price: true });
      return;
    }

    mutation.mutate(payload);
  };

  const handleCancel = () => {
    clearDraft();
    navigate(`/ads/${numericId}`);
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const resetField = (key: keyof FormState) => {
    if (!item) return;
    if (key === 'price') {
      updateField('price', item.price !== null ? String(item.price) : '');
    } else if (key === 'description') {
      updateField('description', item.description ?? '');
    } else if (key === 'title') {
      updateField('title', item.title);
    } else if (key === 'category') {
      updateField('category', item.category);
      updateField('params', { ...item.params });
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (form) {
      const formErrors = validateForm({ title: form.title, price: form.price });
      setErrors((prev) => ({ ...prev, [field]: formErrors[field as keyof FormErrors] }));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.layoutWrapper}>
        <div className={styles.page}>
          <Skeleton width={200} height={16} style={{ marginBottom: 20 }} />
          <div className={styles.formCard}>
            <Skeleton width={350} height={32} style={{ marginBottom: 32 }} />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={60} style={{ marginBottom: 24 }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className={styles.layoutWrapper}>
        <div className={styles.page}>
          <ErrorBlock
            title="Объявление не найдено"
            message="Не удалось загрузить данные для редактирования"
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!form) return null;

  const isFormValid = form.title.trim() !== '' && form.price !== '' && Number(form.price) >= 0;

  const isModified = (field: keyof FormState) => {
    if (!item) return false;
    if (field === 'price') return Number(form.price) !== Number(item.price);
    if (field === 'description') return form.description !== (item.description ?? '');
    if (field === 'title') return form.title !== item.title;
    if (field === 'category') return form.category !== item.category;
    return false;
  };

  const renderModifiedSuffix = (field: keyof FormState) => {
    if (!isModified(field)) return null;

    let originalValue: string | number | undefined;
    if (field === 'price') originalValue = item?.price !== null ? item?.price : undefined;
    else if (field === 'description') originalValue = item?.description || undefined;
    else if (field === 'title') originalValue = item?.title;
    else if (field === 'category') originalValue = CATEGORY_LABELS[item?.category as ItemCategory];

    return <ModifiedBadge originalValue={originalValue} onReset={() => resetField(field)} />;
  };

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.page}>
        <Flex justify="between" align="center" style={{ marginBottom: 20 }}>
          <BackLink to={`/ads/${numericId}`}>Вернуться к объявлению</BackLink>
          <Button 
            variant="ai" 
            size="sm" 
            onClick={() => setIsChatOpen(true)}
            icon={<Sparkles size={16} />}
          >
            Чат с ИИ
          </Button>
        </Flex>

        {hasDraftRestored && (
          <Flex align="center" gap={2} className={styles.draftNotice}>
            <Save size={16} />
            <Typography variant="body2" weight="semibold" color="inherit">
              Восстановлен черновик. Изменения будут сохраняться автоматически.
            </Typography>
          </Flex>
        )}

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <Typography variant="h2" as="h1" className={styles.formTitle}>
            Редактирование объявления
          </Typography>
          <Stack gap={3}>
            <Typography variant="h4" as="h2">
              Основное
            </Typography>
            <Grid minColWidth={320} gap={2}>
              <Stack gap={2}>
                <Select
                  label="Категория"
                  suffix={renderModifiedSuffix('category')}
                  value={form.category}
                  onChange={(e) => {
                    updateField('category', e.target.value as ItemCategory);
                    updateField('params', {});
                  }}
                  options={CATEGORY_OPTIONS}
                />

                <Input
                  label="Название"
                  suffix={renderModifiedSuffix('title')}
                  required
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  onClear={() => updateField('title', '')}
                  onBlur={() => handleBlur('title')}
                  error={touched.title ? errors.title : undefined}
                />

                <Input
                  label="Цена"
                  suffix={renderModifiedSuffix('price')}
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  onClear={() => updateField('price', '')}
                  onBlur={() => handleBlur('price')}
                  error={touched.price ? errors.price : undefined}
                  min={0}
                />

                <AiPriceButton
                  title={form.title}
                  category={form.category}
                  params={form.params}
                  onApply={(price) => updateField('price', String(price))}
                />
              </Stack>
            </Grid>
          </Stack>

          <Stack gap={3}>
            <Typography variant="h4" as="h2">
              Характеристики
            </Typography>
            <Grid minColWidth={280} gap={2}>
              <CategoryFields
                category={form.category}
                params={form.params}
                originalParams={item.params}
                onChange={(params) => updateField('params', params)}
              />
            </Grid>
            <Textarea
              label="Описание"
              suffix={renderModifiedSuffix('description')}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              currentLength={form.description.length}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />

            <Flex gap={2} wrap>
              <AiDescriptionButton
                title={form.title}
                category={form.category}
                price={form.price ? Number(form.price) : null}
                params={form.params}
                currentDescription={form.description}
                onApply={(text) => updateField('description', text)}
              />
              {form.description !== (item.description ?? '') && (
                <Button 
                  type="button"
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsDiffModalOpen(true)}
                >
                  Просмотреть изменения
                </Button>
              )}
            </Flex>
          </Stack>

          <Flex gap={3}>
            <Button
              type="submit"
              variant="primary"
              isLoading={mutation.isPending}
              disabled={!isFormValid}
            >
              Сохранить
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Отменить
            </Button>
          </Flex>
        </form>
      </div>

      <AiChatAside 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        adData={{
          title: form.title,
          category: form.category,
          price: form.price ? Number(form.price) : null,
          params: form.params,
          description: form.description
        }}
        onApplyDescription={(text) => updateField('description', text)}
      />

      <DiffModal 
        isOpen={isDiffModalOpen}
        onClose={() => setIsDiffModalOpen(false)}
        oldText={item.description ?? ''}
        newText={form.description}
        title="Сравнение описания"
      />
    </div>
  );
}
