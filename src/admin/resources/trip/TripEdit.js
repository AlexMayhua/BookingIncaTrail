import { Edit, SimpleForm } from 'react-admin';
import TripFormFields from './TripFormFields';

export default function TripEdit() {
  return (
    <Edit mutationMode='pessimistic'>
      <SimpleForm>
        <TripFormFields />
      </SimpleForm>
    </Edit>
  );
}
