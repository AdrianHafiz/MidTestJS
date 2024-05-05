const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');
const { errorResponder, errorTypes } = require('../../../core/errors');

// Object untuk menyimpan jumlah percobaan login gagal dan timestamp terakhir
const failedLoginAttempts = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  try {
    //untuk mendapatkan jumlah percobaan login gagal dan timestamp terakhir
    const { attempts, lastAttemptTimestamp } = failedLoginAttempts[email] || {
      attempts: 0,
      lastAttemptTimestamp: 0,
    };

    //untuk memeriksa apakah sudah lebih dari 30 menit sejak percobaan login terakhir
    const thirtyMinutesAgo = Date.now() - 30 * 60 * 1000;
    const isThirtyMinutesPassed = lastAttemptTimestamp <= thirtyMinutesAgo;

    //jika sudah lebih dari 30 menit, reset percobaan login
    if (isThirtyMinutesPassed) {
      failedLoginAttempts[email] = { attempts: 0, lastAttemptTimestamp: 0 };
    }

    //untuk mengecek apakah jumlah percobaan login gagal telah mencapai batasan yang ditentukan
    if (attempts >= 5) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts'
      );
    }

    const user = await authenticationRepository.getUserByEmail(email);

    const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
    const passwordChecked = await passwordMatched(password, userPassword);

    //jika login berhasil
    if (user && passwordChecked) {
      //maka reset jumlah percobaan login gagal jika login berhasil
      failedLoginAttempts[email] = { attempts: 0, lastAttemptTimestamp: 0 };

      //log untuk login berhasil
      console.log(`[${new Date().toISOString()}] User ${email} berhasil login`);

      //logout
      console.log(`[${new Date().toISOString()}] User ${email} logout`);

      return {
        email: user.email,
        name: user.name,
        user_id: user.id,
        token: generateToken(user.email, user.id),
      };
    } else {
      //tambahkan jumlah percobaan login gagal jika login gagal
      failedLoginAttempts[email] = {
        attempts: attempts + 1,
        lastAttemptTimestamp: Date.now(),
      };

      //log untuk percobaan login gagal
      console.log(
        `[${new Date().toISOString()}] User ${email} gagal login. Attempt = ${attempts + 1}`
      );

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }
  } catch (error) {
    // Handle errors
    throw error;
  }
}

module.exports = {
  checkLoginCredentials,
};
