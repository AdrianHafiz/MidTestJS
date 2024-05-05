const { User } = require('../../../models');

/**
 * Get a list of users
 * @param {number} page_number - Page number
 * @param {number} page_size - Page size
 * @param {string} sort - Sort field and order
 * @param {string} search - Search keyword
 * @returns {Promise}
 */
async function getUsers(page_number, page_size, sort, search) {
  let query = User.find({});

  // Pagination fungsi untuk membagi data ke beberapa halaman
  query = query.skip((page_number - 1) * page_size).limit(page_size);

  // Sorting untuk menyortir/mengurutkan data secara ascending/descending sesuai request user
  if (sort) {
    const [field, order] = sort.split(':');
    const sortOrder = order === 'asc' ? 1 : -1;
    query = query.sort({ [field]: sortOrder });
  }

  // Searching untuk mempermudah user mencari data yang lebih spesifik
  if (search) {
    query = query.or([
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]);
  }
  //fungsi ini untuk menghitung total count dari seluruh data yang ada tanpa memperdulikan fungsi pagination
  const users = await query.exec();
  const count = await User.countDocuments();
  //lalu mengembalikannya ke fungsi data, dan count
  return { data: users, count };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
};
