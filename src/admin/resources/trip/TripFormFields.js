import { useEffect, useState } from 'react';
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
  required,
  minValue,
} from 'react-admin';
import dynamic from 'next/dynamic';
import { CATEGORY_CHOICES, LANG_CHOICES } from './TripList';

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
export default function TripFormFields() {
  return (
    <>
      {/* ── 1. INFORMACIÓN BÁSICA ──────────────────────────── */}
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

      {/* ── 2. SEO & METADATA ──────────────────────────────── */}
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

      {/* ── 5. GALLERY ─────────────────────────────────────── */}
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

      {/* ── 6. QUICK STATS ─────────────────────────────────── */}
      <SectionTitle label='Quick Stats' />

      <ArrayInput source='quickstats'>
        <SimpleFormIterator inline>
          <TextInput source='title' />
          <TextInput source='content' />
          <TextInput source='icon' label='Icon URL' />
        </SimpleFormIterator>
      </ArrayInput>

      {/* ── 7. INFORMATION TABS ────────────────────────────── */}
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

      {/* ── 8. DESCUENTOS POR GRUPO ────────────────────────── */}
      <FormDataConsumer>
        {({ formData }) =>
          formData?.enableDiscount && (
            <>
              <SectionTitle label='Descuentos por Grupo' />
              <ArrayInput source='ardiscounts'>
                <SimpleFormIterator inline>
                  <TextInput source='people' label='People' />
                  <NumberInput source='discount' label='Discount %' />
                  <NumberInput source='price' label='Final Price' />
                </SimpleFormIterator>
              </ArrayInput>
            </>
          )
        }
      </FormDataConsumer>
    </>
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
