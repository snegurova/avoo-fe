import { categoriesApi } from '@avoo/axios';
import { HomePage } from '../_components/HomePage/HomePage';

export const HomePageServer = async () => {
  const categories = await categoriesApi.getAll();

  return categories ? <HomePage data={categories} /> : null;
};
