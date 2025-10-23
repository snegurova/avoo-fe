import { HomePage } from './_components/HomePage/HomePage';

const getData = () => {
  return { message: 'Hello from server-side data fetching!' };
}

export const Page = () => {
  const data = getData();
  
  return <HomePage data={data} />;
  };

export default Page;  
