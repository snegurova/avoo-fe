export const typeGuardHooks= {
  isString(value: unknown): value is string {
    return typeof value === 'string';
  },
};

