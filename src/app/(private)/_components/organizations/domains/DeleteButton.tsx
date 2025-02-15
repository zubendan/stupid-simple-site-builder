import { modals } from '@mantine/modals';
import { api } from '~/trpc/react';
import { ActionMenuItem } from '../../ListActions';

export const DeleteDomainButton = ({ hashid }: { hashid: string }) => {
  const { mutateAsync: deleteMutation } = api.domain.delete.useMutation();
  const utils = api.useUtils();

  const openModal = () =>
    modals.openConfirmModal({
      title: `Delete Domain`,
      children: (
        <span>
          Are you sure you want to delete this domain? This will be permanently
          deleted.
        </span>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => {
        void deleteMutation({ hashid }).then(async (data) => {
          if (data) {
            modals.closeAll();
            await utils.domain.infiniteList.invalidate();
          }
        });
      },
      confirmProps: { color: 'red' },
    });

  return (
    <ActionMenuItem
      onClick={openModal}
      icon='tabler:trash'
      text={'Delete'}
      className='text-lg text-red-500'
    />
  );
};
