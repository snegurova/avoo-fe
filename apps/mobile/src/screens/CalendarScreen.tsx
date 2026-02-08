import Layout from '@/shared/Layout/Layout';
import { CalendarSection } from '@/components/CalendarSection/CalendarSection';

export const CalendarScreen = () => {
  return (
    <Layout hasBottomTab={true}>
      <CalendarSection />
    </Layout>
  );
};
