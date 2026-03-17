import { Admin, Resource, memoryStore } from 'react-admin';
import dataProvider from '@/admin/dataProvider';
import authProvider from '@/admin/authProvider';
import TripList from '@/admin/resources/trip/TripList';
import TripEdit from '@/admin/resources/trip/TripEdit';
import TripCreate from '@/admin/resources/trip/TripCreate';
import UserList from '@/admin/resources/user/UserList';
import UserEdit from '@/admin/resources/user/UserEdit';
import UserCreate from '@/admin/resources/user/UserCreate';

export default function ReactAdminApp() {
  return (
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      requireAuth
      store={memoryStore()}>
      <Resource
        name='trips'
        list={TripList}
        edit={TripEdit}
        create={TripCreate}
        options={{ label: 'Trips' }}
      />
      <Resource
        name='users'
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        options={{ label: 'Users' }}
      />
    </Admin>
  );
}
