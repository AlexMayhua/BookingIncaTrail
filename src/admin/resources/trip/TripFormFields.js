import { useEffect, useMemo, useRef, useState } from 'react';
import {
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  FormDataConsumer,
  ImageInput,
  ImageField,
  useInput,
  useRecordContext,
  required,
  minValue,
} from 'react-admin';
import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { CATEGORY_CHOICES, LANG_CHOICES } from './TripList';
import {
  TRIP_DRAFT_STATUS,
  clearTripDraft,
  formatTripDraftTimestamp,
  getTripDraft,
  hasTripDraftContent,
  sanitizeTripDraftValues,
  saveTripDraft,
} from './tripDraftStorage';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

/**
 * Campos reutilizables del formulario Trip para Create y Edit.
 *
 * Secciones:
 *   1. Información básica
 *   2. SEO & Metadata
 *   3. Detalles del tour
 *   4. Gallery (URLs)
 *   5. Quick Stats
 *   6. Information tabs (itinerario, incluye, etc.)
 *   7. Descuentos
 */
export default function TripFormFields({ mode }) {
  return (
    <>
      <TripDraftManager mode={mode} />

      {/* ── 1. SEO & METADATA ──────────────────────────────── */}
      <SectionTitle label='SEO & Metadata' />

      <TextInput source='meta_title' label='Meta Title' fullWidth />
      <TextInput
        source='meta_description'
        label='Meta Description'
        fullWidth
        multiline
        rows={3}
      />
      <HtmlEditorInput
        source='navbar_description'
        label='Navbar Description (HTML)'
        fullWidth
        multiline
        rows={3}
      />

      {/* ── 2. INFORMACIÓN BÁSICA ──────────────────────────── */}
      <SectionTitle label='Información Básica' />

      <TextInput source='title' validate={required()} fullWidth />
      <TextInput source='sub_title' label='Subtitle' fullWidth />
      <TextInput source='highlight' fullWidth multiline rows={2} />
      <TextInput
        source='slug'
        fullWidth
        helperText='URL slug (e.g. inca-trail-4-days)'
      />

      <div style={{ display: 'flex', gap: 16 }}>
        <SelectInput
          source='category'
          choices={CATEGORY_CHOICES}
          validate={required()}
        />
        <SelectInput
          source='lang'
          label='Language'
          choices={LANG_CHOICES}
          validate={required()}
        />
      </div>

      {/* ── 3. DETALLES DEL TOUR ───────────────────────────── */}
      <SectionTitle label='Detalles del Tour' />

      <div style={{ display: 'flex', gap: 16 }}>
        <NumberInput source='price' validate={[required(), minValue(0)]} />
        <TextInput source='duration' helperText='e.g. 4 Days / 3 Nights' />
        <NumberInput source='discount' label='Discount %' min={0} max={100} />
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <TextInput source='wetravel' label='WeTravel URL' fullWidth />
        <TextInput source='url_brochure' label='Brochure URL' fullWidth />
      </div>

      <TextInput source='offer' label='Offer Text' fullWidth />
      <TextInput
        source='linkedTripId'
        label='Linked Trip ID (i18n)'
        fullWidth
      />

      <div style={{ display: 'flex', gap: 16 }}>
        <BooleanInput source='isDeals' label='Show in Deals' />
        <BooleanInput source='enableDiscount' label='Enable Discount' />
      </div>

      {/* ── 4. DESCRIPTION (HTML) ──────────────────────────── */}
      <SectionTitle label='Description' />

      <HtmlEditorInput
        source='description'
        label='Description'
        fullWidth
        multiline
        rows={8}
        helperText='Accepts HTML content'
      />

      {/* ── 5. QUICK STATS ─────────────────────────────────── */}
      <SectionTitle label='Quick Stats' />

      <ArrayInput source='quickstats'>
        <SimpleFormIterator inline>
          <TextInput source='title' />
          <TextInput source='content' />
        </SimpleFormIterator>
      </ArrayInput>

      {/* ── 6. INFORMATION TABS ────────────────────────────── */}
      <SectionTitle label='Information Tabs' />

      <ArrayInput source='information'>
        <SimpleFormIterator>
          <TextInput source='title' label='Tab Title' fullWidth />
          <HtmlEditorInput
            source='content'
            label='Tab Content (HTML)'
            fullWidth
            multiline
            rows={4}
          />
        </SimpleFormIterator>
      </ArrayInput>

      {/* ── 7. GALLERY ─────────────────────────────────────── */}
      <SectionTitle label='Gallery' />

      <ArrayInput source='gallery'>
        <SimpleFormIterator inline>
          <ImageInput
            source='file'
            label='Upload image'
            accept={{
              'image/*': [],
            }}>
            <ImageField source='src' title='title' />
          </ImageInput>
          <TextInput
            source='url'
            label='Image URL (optional)'
            helperText='Si subes archivo, este campo se reemplaza con /storage/...'
          />
          <TextInput source='alt' label='Alt Text' />
        </SimpleFormIterator>
      </ArrayInput>

      {/* ── 8. DESCUENTOS POR GRUPO ────────────────────────── */}
      <FormDataConsumer>
        {({ formData }) =>
          formData?.enableDiscount && (
            <>
              <SectionTitle label='Descuentos por Grupo' />
              <ArrayInput source='ardiscounts'>
                <SimpleFormIterator inline>
                  <TextInput source='persons' label='People' />
                  <NumberInput source='pdiscount' label='Discount %' />
                </SimpleFormIterator>
              </ArrayInput>
            </>
          )
        }
      </FormDataConsumer>
    </>
  );
}

function TripDraftManager({ mode }) {
  const record = useRecordContext();
  const tripId = mode === 'edit' ? record?.id : null;
  const { control, setValue } = useFormContext();
  const { isDirty, isReady } = useFormState({ control });
  const formValues = useWatch({ control });
  const saveTimeoutRef = useRef(null);
  const restoredKeyRef = useRef(null);
  const restoredSnapshotRef = useRef(null);
  const [draftStatus, setDraftStatus] = useState(null);
  const [draftUpdatedAt, setDraftUpdatedAt] = useState(null);

  const canManageDraft = mode === 'create' || Boolean(tripId);
  const sanitizedValues = useMemo(
    () => sanitizeTripDraftValues(formValues),
    [formValues],
  );
  const serializedValues = useMemo(
    () => JSON.stringify(sanitizedValues),
    [sanitizedValues],
  );
  const hasCreateDraftContent = useMemo(
    () => hasTripDraftContent(sanitizedValues),
    [sanitizedValues],
  );

  useEffect(() => {
    if (!canManageDraft || !isReady) {
      return;
    }

    const currentDraftKey = `${mode}:${tripId || 'create'}`;
    if (restoredKeyRef.current === currentDraftKey) {
      return;
    }

    restoredKeyRef.current = currentDraftKey;

    const currentDraft = getTripDraft({ mode, tripId });
    if (currentDraft?.values && Object.keys(currentDraft.values).length > 0) {
      Object.entries(currentDraft.values).forEach(([fieldName, fieldValue]) => {
        setValue(fieldName, fieldValue, {
          shouldDirty: true,
          shouldTouch: false,
          shouldValidate: false,
        });
      });

      restoredSnapshotRef.current = JSON.stringify(currentDraft.values);
      setDraftStatus(TRIP_DRAFT_STATUS.TEMPORARY);
      setDraftUpdatedAt(currentDraft.updatedAt || null);
      return;
    }

    restoredSnapshotRef.current = null;
    setDraftUpdatedAt(null);
    setDraftStatus(mode === 'edit' ? TRIP_DRAFT_STATUS.SAVED : null);
  }, [canManageDraft, isReady, mode, setValue, tripId]);

  useEffect(() => {
    if (!canManageDraft || !isReady) {
      return undefined;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (!isDirty || (mode === 'create' && !hasCreateDraftContent)) {
      clearTripDraft({ mode, tripId });
      restoredSnapshotRef.current = null;
      setDraftUpdatedAt(null);
      setDraftStatus(mode === 'edit' ? TRIP_DRAFT_STATUS.SAVED : null);
      return undefined;
    }

    if (
      restoredSnapshotRef.current &&
      restoredSnapshotRef.current === serializedValues
    ) {
      restoredSnapshotRef.current = null;
      setDraftStatus(TRIP_DRAFT_STATUS.TEMPORARY);
      return undefined;
    }

    setDraftStatus(TRIP_DRAFT_STATUS.SAVING_LOCAL);

    saveTimeoutRef.current = window.setTimeout(() => {
      const savedDraft = saveTripDraft({
        mode,
        tripId,
        values: sanitizedValues,
      });

      if (!savedDraft) {
        return;
      }

      setDraftUpdatedAt(savedDraft.updatedAt);
      setDraftStatus(TRIP_DRAFT_STATUS.TEMPORARY);
      saveTimeoutRef.current = null;
    }, 700);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
    };
  }, [
    canManageDraft,
    hasCreateDraftContent,
    isDirty,
    isReady,
    mode,
    sanitizedValues,
    serializedValues,
    tripId,
  ]);

  return (
    <TripDraftStatusBanner
      status={draftStatus}
      updatedAt={draftUpdatedAt}
    />
  );
}

function TripDraftStatusBanner({ status, updatedAt }) {
  if (!status) {
    return null;
  }

  const savedAtLabel = formatTripDraftTimestamp(updatedAt);
  const statusConfig = {
    [TRIP_DRAFT_STATUS.SAVED]: {
      label: 'Version guardada',
      message: 'Estas viendo la version persistida del trip.',
      borderColor: '#3b82f6',
      background: '#eff6ff',
      color: '#1d4ed8',
    },
    [TRIP_DRAFT_STATUS.TEMPORARY]: {
      label: 'Borrador temporal',
      message: 'Estas viendo cambios restaurados desde storage local.',
      borderColor: '#f59e0b',
      background: '#fffbeb',
      color: '#b45309',
    },
    [TRIP_DRAFT_STATUS.SAVING_LOCAL]: {
      label: 'Guardando borrador...',
      message: 'Guardando cambios locales para protegerte ante una recarga.',
      borderColor: '#7c3aed',
      background: '#f5f3ff',
      color: '#6d28d9',
    },
  }[status];

  if (!statusConfig) {
    return null;
  }

  return (
    <div
      style={{
        width: '100%',
        marginBottom: 20,
        padding: '12px 14px',
        borderRadius: 10,
        border: `1px solid ${statusConfig.borderColor}`,
        background: statusConfig.background,
        color: statusConfig.color,
      }}>
      <div style={{ fontSize: 14, fontWeight: 700 }}>{statusConfig.label}</div>
      <div style={{ marginTop: 4, fontSize: 13 }}>{statusConfig.message}</div>

      {savedAtLabel ? (
        <small style={{ display: 'block', marginTop: 6, color: '#5f6b7a' }}>
          Ultimo guardado local: {savedAtLabel}
        </small>
      ) : null}
    </div>
  );
}

function SectionTitle({ label }) {
  return (
    <h3
      style={{
        width: '100%',
        borderBottom: '2px solid #e6c200',
        paddingBottom: 8,
        marginTop: 24,
        marginBottom: 8,
        fontSize: '1rem',
        fontWeight: 600,
        color: '#0d1117',
      }}>
      {label}
    </h3>
  );
}

function HtmlEditorInput({ source, label, helperText }) {
  const { field } = useInput({ source });
  const [editorValue, setEditorValue] = useState(field.value || '');

  useEffect(() => {
    setEditorValue(field.value || '');
  }, [field.value]);

  const handleChange = (content) => {
    setEditorValue(content);
    setTimeout(() => field.onChange(content), 0);
  };

  const handleBlur = () => {
    setTimeout(() => field.onBlur(), 0);
  };

  return (
    <div style={{ width: '100%', marginBottom: 16 }}>
      <label
        style={{
          display: 'block',
          fontSize: 14,
          fontWeight: 600,
          marginBottom: 6,
          color: '#0d1117',
        }}>
        {label}
      </label>

      <ReactQuill
        theme='snow'
        value={editorValue}
        onChange={handleChange}
        onBlur={handleBlur}
        modules={{
          toolbar: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'clean'],
          ],
        }}
      />

      <small style={{ display: 'block', marginTop: 8, color: '#5f6b7a' }}>
        {helperText}
      </small>
    </div>
  );
}
