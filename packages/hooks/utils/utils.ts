export const utils = {
  submitAdapter: <T>(submitFn: (data: T) => void) => {
    return (data: T) => {
      submitFn(data);
    };
  },
};
