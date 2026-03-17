import { Create, SimpleForm } from 'react-admin';
import TripFormFields from './TripFormFields';


export default function TripCreate() {
  return (
    <Create>
      <SimpleForm>
        <TripFormFields />
      </SimpleForm>
    </Create>
  );
}
