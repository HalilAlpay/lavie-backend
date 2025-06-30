const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { name, price, category, description } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Product name must be at least 2 characters long.' });
  }

  if (!price || !price.current || price.current <= 0) {
    return res.status(400).json({ error: 'Product price must be greater than 0.' });
  }

  if (!category) {
    return res.status(400).json({ error: 'Product category is required.' });
  }

  if (!description || description.length < 10) {
    return res.status(400).json({ error: 'Product description must be at least 10 characters long.' });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUser,
  validateProduct
}; 