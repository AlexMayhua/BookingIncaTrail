import {
  Create,
  SimpleForm,
  useNotify,
  useRedirect,
  useResourceContext,
  useTranslate,
} from 'react-admin';
import TripFormFields from './TripFormFields';
import { clearTripDraft } from './tripDraftStorage';

export default function TripCreate() {
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const resource = useResourceContext() || 'trips';

  return (
    <Create
      mutationOptions={{
        onSuccess: (data) => {
          clearTripDraft({ mode: 'create' });

          notify(`resources.${resource}.notifications.created`, {
            type: 'info',
            messageArgs: {
              smart_count: 1,
              _: translate('ra.notification.created', {
                smart_count: 1,
              }),
            },
          });

          redirect('edit', resource, data.id, data);
        },
      }}>
      <SimpleForm warnWhenUnsavedChanges>
        <TripFormFields mode='create' />
      </SimpleForm>
    </Create>
  );
}
