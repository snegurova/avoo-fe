import Layout from '@/shared/Layout/Layout';
import { CalendarSection } from '@/components/CalendarSection/CalendarSection';

export const HomeScreen = () => {
  return (
    <Layout hasBottomTab={true}>
      <CalendarSection />
    </Layout>
  );
};

export default HomeScreen;
