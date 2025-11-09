const formatHooks = {
  useMaskEmail: (email: string) => {
    const local = email.split('@')[0];
    const head = local.slice(0, 1);
    const tail = local.slice(-1);
    return `${head}*****${tail}@${email.split('@')[1]}`;
  },
};

export default formatHooks;