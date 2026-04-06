import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  EditButton,
  DeleteButton,
  TextInput,
  SelectInput,
  Filter,
  useRecordContext,
} from 'react-admin';

const CATEGORY_CHOICES = [
  { id: 'inca-trail', name: 'Inca Trail' },
  { id: 'salkantay', name: 'Salkantay' },
  { id: 'machupicchu', name: 'Machu Picchu' },
  { id: 'choquequirao', name: 'Choquequirao' },
  { id: 'rainbow-mountain', name: 'Rainbow Mountain' },
  { id: 'ausangate', name: 'Ausangate' },
  { id: 'inca-jungle', name: 'Inca Jungle' },
  { id: 'sacred-lakes', name: 'Sacred Lakes' },
  { id: 'day-tours', name: 'Day Tours' },
  { id: 'peru-packages', name: 'Peru Packages' },
  { id: 'luxury-glamping', name: 'Luxury Glamping' },
  { id: 'family-tours', name: 'Family Tours' },
  { id: 'sustainable-tours', name: 'Sustainable Tours' },
];

const LANG_CHOICES = [
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Español' },
];

function TripFilters(props) {
  return (
    <Filter {...props}>
      <TextInput label='Search' source='q' alwaysOn />
      <SelectInput source='category' choices={CATEGORY_CHOICES} />
      <SelectInput source='lang' choices={LANG_CHOICES} />
    </Filter>
  );
}

function ThumbnailField() {
  const record = useRecordContext();
  const url = record?.gallery?.[0]?.url;
  if (!url) return null;
  return (
    <img
      src={url}
      alt={record.title}
      style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }}
    />
  );
}

export default function TripList() {
  return (
    <List
      filters={<TripFilters />}
      sort={{ field: 'createdAt', order: 'DESC' }}
      perPage={25}>
      <Datagrid rowClick='edit' bulkActionButtons={<DeleteButton />}>
        <ThumbnailField label='Image' />
        <TextField source='title' />
        <TextField source='category' />
        <NumberField
          source='price'
          options={{ style: 'currency', currency: 'USD' }}
        />
        <TextField source='duration' />
        <TextField source='lang' label='Language' />
        <TextField source='slug' />
        <BooleanField source='isDeals' label='Deal' />
        <NumberField source='discount' label='Discount %' />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}

export { CATEGORY_CHOICES, LANG_CHOICES };
