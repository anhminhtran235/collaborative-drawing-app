const createShortId = () => {
  let chars = 'abcdefghijklmnopqrstuvwxyz';
  let id = '';
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      id += randomChar;
    }
    if (i < 2) {
      id += '-';
    }
  }
  return id;
};

module.exports = { createShortId };
