import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
} from 'react-admin';

export default function UserEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source='name' />
        <TextInput source='email' type='email' />
        <SelectInput
          source='role'
          choices={[
            { id: 'user', name: 'User' },
            { id: 'admin', name: 'Admin' },
          ]}
        />
        <BooleanInput source='root' />
        <TextInput
          source='password'
          type='password'
          helperText='Leave empty to keep current password'
        />
      </SimpleForm>
    </Edit>
  );
}
