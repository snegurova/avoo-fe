import HomeView from './HomeView';

const getData = () => {
  return { message: 'Hello from server-side data fetching!' };
}

export const Page = () => {
  const data = getData();
  return <HomeView data={ data } />;
  };

export default Page;  
