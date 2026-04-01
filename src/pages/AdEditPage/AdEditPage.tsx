import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchItem,
  updateItem,
  CATEGORY_LABELS,
  type ItemCategory,
  type ItemParams,
  type ItemUpdatePayload,
} from '../../entities/ad';
import { CategoryFields, useDraftStorage, validateForm, hasErrors, type FormErrors } from '../../features/ad-form';
import { AiDescriptionButton, AiPriceButton } from '../../features/ai-assistant';
import { Button } from '../../shared/ui/Button';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Textarea } from '../../shared/ui/Textarea';
import { Skeleton } from '../../shared/ui/Skeleton';
import { ErrorBlock } from '../../shared/ui/ErrorBlock';
import { useToast } from '../../shared/ui/Toast';
import { DESCRIPTION_MAX_LENGTH } from '../../shared/config/constants';
import { Save } from 'lucide-react';
import styles from './AdEditPage.module.css';

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

  const { data: item, isLoading, isError, refetch } = useQuery({
    queryKey: ['item', numericId],
    queryFn: ({ signal }) => fetchItem(numericId, signal),
    enabled: !isNaN(numericId),
  });

  const handleDraftRestore = useCallback((draft: FormState) => {
    setForm(draft);
    setHasDraftRestored(true);
  }, []);

  const { saveDraft, clearDraft, hasDraft } = useDraftStorage<FormState>(
    numericId,
    form,
    handleDraftRestore,
  );

  // Initialize form from fetched data (only if no draft was restored and no draft exists)
  useEffect(() => {
    if (item && !form && !hasDraftRestored && !hasDraft()) {
      setForm({
        category: item.category,
        title: item.title,
        description: item.description ?? '',
        price: item.price !== null ? String(item.price) : '',
        params: { ...item.params },
      });
    }
  }, [item, form, hasDraftRestored]);

  // Auto-save draft on form changes
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

    const formErrors = validateForm(payload);
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

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (form) {
      const payload: ItemUpdatePayload = {
        category: form.category,
        title: form.title.trim(),
        price: Number(form.price),
        params: form.params,
      };
      const formErrors = validateForm(payload);
      setErrors((prev) => ({ ...prev, [field]: formErrors[field as keyof FormErrors] }));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Skeleton width={200} height={16} style={{ marginBottom: 20 }} />
        <div className={styles.formCard}>
          <Skeleton width={350} height={32} style={{ marginBottom: 32 }} />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={60} style={{ marginBottom: 24 }} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className={styles.page}>
        <ErrorBlock
          title="Объявление не найдено"
          message="Не удалось загрузить данные для редактирования"
          onRetry={() => refetch()}
        />
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

  const renderLabel = (text: string, modified: boolean) => {
    if (!modified) return text;
    return (
      <span className={styles.modifiedLabelWrapper}>
        {text}
        <span className={styles.modifiedBadge}>изменено в черновике</span>
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <Link to={`/ads/${numericId}`} className={styles.backLink}>
        ← Вернуться к объявлению
      </Link>

      {hasDraftRestored && (
        <div className={styles.draftNotice}>
          <Save size={16} style={{ marginBottom: '-2px' }} /> Восстановлен черновик. Изменения будут сохраняться автоматически.
        </div>
      )}

      <form className={styles.formCard} onSubmit={handleSubmit}>
        <h1 className={styles.formTitle}>Редактирование объявления</h1>

        {/* Category */}
        <div className={styles.formSection}>
          <div className={styles.categorySelect}>
            <Select
              label={renderLabel("Категория", isModified('category'))}
              value={form.category}
              onChange={(e) => {
                updateField('category', e.target.value as ItemCategory);
                updateField('params', {});
              }}
              options={CATEGORY_OPTIONS}
            />
          </div>
        </div>

        {/* Title */}
        <div className={styles.formSection}>
          <div className={styles.fieldMain}>
            <Input
              label={renderLabel("Название", isModified('title'))}
              required
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              onClear={() => updateField('title', '')}
              onBlur={() => handleBlur('title')}
              error={touched.title ? errors.title : undefined}
              placeholder="Название"
            />
          </div>
        </div>

        {/* Price */}
        <div className={styles.formSection}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldMain}>
              <Input
                label={renderLabel("Цена", isModified('price'))}
                required
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                onClear={() => updateField('price', '')}
                onBlur={() => handleBlur('price')}
                error={touched.price ? errors.price : undefined}
                placeholder="Цена"
                min={0}
              />
            </div>
            <AiPriceButton
              title={form.title}
              category={form.category}
              params={form.params}
              onApply={(price) => updateField('price', String(price))}
            />
          </div>
        </div>

        {/* Category-specific fields */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Характеристики</h2>
          <div className={styles.paramsGrid}>
            <CategoryFields
              category={form.category}
              params={form.params}
              originalParams={item.params}
              onChange={(params) => updateField('params', params)}
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>{renderLabel("Описание", isModified('description'))}</h2>
          <div className={styles.descriptionWrapper}>
            <Textarea
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Описание товара..."
              currentLength={form.description.length}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <AiDescriptionButton
              title={form.title}
              category={form.category}
              price={form.price ? Number(form.price) : null}
              params={form.params}
              currentDescription={form.description}
              onApply={(text) => updateField('description', text)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className={styles.formActions}>
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
        </div>
      </form>
    </div>
  );
}
