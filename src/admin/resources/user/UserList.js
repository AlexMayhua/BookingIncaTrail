import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  BooleanField,
  EditButton,
  DeleteButton,
} from 'react-admin';

export default function UserList() {
  return (
    <List perPage={25} sort={{ field: 'createdAt', order: 'DESC' }}>
      <Datagrid rowClick='edit'>
        <TextField source='name' />
        <EmailField source='email' />
        <TextField source='role' />
        <BooleanField source='root' />
        <DateField source='createdAt' label='Created' />
        <EditButton />
        <DeleteButton />
      </Datagrid>
    </List>
  );
}
