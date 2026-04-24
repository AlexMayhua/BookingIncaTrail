import {
  Edit,
  SimpleForm,
  useNotify,
  useRedirect,
  useResourceContext,
  useTranslate,
} from 'react-admin';
import TripFormFields from './TripFormFields';
import { clearTripDraft } from './tripDraftStorage';

export default function TripEdit() {
  const notify = useNotify();
  const redirect = useRedirect();
  const translate = useTranslate();
  const resource = useResourceContext() || 'trips';

  return (
    <Edit
      mutationMode='pessimistic'
      mutationOptions={{
        onSuccess: (data) => {
          clearTripDraft({ mode: 'edit', tripId: data.id });

          notify(`resources.${resource}.notifications.updated`, {
            type: 'info',
            messageArgs: {
              smart_count: 1,
              _: translate('ra.notification.updated', {
                smart_count: 1,
              }),
            },
          });

          redirect('list', resource, data.id, data);
        },
      }}>
      <SimpleForm warnWhenUnsavedChanges>
        <TripFormFields mode='edit' />
      </SimpleForm>
    </Edit>
  );
}
