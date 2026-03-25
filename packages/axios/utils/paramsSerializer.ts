export const paramsSerializer = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((val) => {
        searchParams.append(key, String(val));
      });
    } else if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
};
