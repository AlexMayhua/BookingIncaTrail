import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  required,
} from 'react-admin';

export default function UserCreate() {
  return (
    <Create>
      <SimpleForm>
        <TextInput source='name' validate={required()} />
        <TextInput source='email' type='email' validate={required()} />
        <TextInput source='password' type='password' validate={required()} />
        <SelectInput
          source='role'
          choices={[
            { id: 'user', name: 'User' },
            { id: 'admin', name: 'Admin' },
          ]}
          defaultValue='user'
        />
      </SimpleForm>
    </Create>
  );
}
