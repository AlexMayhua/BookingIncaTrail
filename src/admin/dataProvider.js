import tripDataProvider from './resources/trip/tripDataProvider';
import userDataProvider from './resources/user/userDataProvider';

/**
 * Combines multiple resource-specific dataProviders into one.
 * react-admin calls the dataProvider with the resource name,
 * and we route to the appropriate provider.
 */
const providerMap = {
  trips: tripDataProvider,
  users: userDataProvider,
};

function getProvider(resource) {
  return providerMap[resource] || tripDataProvider;
}

const dataProvider = {
  getList: (resource, params) =>
    getProvider(resource).getList(resource, params),
  getOne: (resource, params) => getProvider(resource).getOne(resource, params),
  getMany: (resource, params) =>
    getProvider(resource).getMany(resource, params),
  getManyReference: (resource, params) =>
    getProvider(resource).getManyReference(resource, params),
  create: (resource, params) => getProvider(resource).create(resource, params),
  update: (resource, params) => getProvider(resource).update(resource, params),
  updateMany: (resource, params) =>
    getProvider(resource).updateMany?.(resource, params),
  delete: (resource, params) => getProvider(resource).delete(resource, params),
  deleteMany: (resource, params) =>
    getProvider(resource).deleteMany?.(resource, params),
};

export default dataProvider;
