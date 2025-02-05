export const generateUserName = function (firstName, lastName) {
  const timestamp = Date.now().toString().slice(-4);
  return `${firstName.slice(0, 2)}_${lastName}${timestamp}`;
};
