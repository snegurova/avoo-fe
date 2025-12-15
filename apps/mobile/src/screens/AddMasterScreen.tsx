import Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';
import { masterHooks } from '@avoo/hooks';
import CreateMasterForm from '@/components/CreateMasterForm';

type Props = RootStackScreenProps<RootScreens.AddMasterScreen>;

export const AddMasterScreen = (props: Props) => {
  const { navigation } = props;
  const { control, handleSubmit, errors, isPending } = masterHooks.useCreateMasterForm({
    onSuccess: () => navigation.goBack(),
  });

  return (
    <Layout>
      <CreateMasterForm
        control={control}
        handleSubmit={handleSubmit}
        errors={errors}
        isPending={isPending}
      />
    </Layout>
  );
};

export default AddMasterScreen;
