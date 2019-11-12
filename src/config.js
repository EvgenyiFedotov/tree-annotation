export const createConifg = (config = {}) => {
  const { builder = () => {}, annotation = () => "" } = config;
  return { builder, annotation };
};
