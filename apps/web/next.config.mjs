import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
