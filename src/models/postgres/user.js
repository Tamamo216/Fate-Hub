const db = require("../../database/postgreSQL");

function findUserByUsername(username) {
  return db.one("SELECT id, username, password, display_name, email, gender, nationality, firstname, lastname, phone_number, TO_CHAR(birthday, 'dd/mm/yyyy') AS birthday FROM users WHERE username = $1", username);
}

// function updateUser(user) {
//   return db.none("UPDATE users SET email = ${email}, firstname = ${firstname}, lastname = ${lastname}, display_name = ${displayName}, phone_number = ${phoneNumber}, gender = ${gender}, nationality = ${nationality}, birthday = TO_DATE(${birthday}, 'DD/MM/YYYY'), avatar = ${avatar} WHERE id = ${id}", user);
// }

// function changePassword(username, newPassword) {
//   return db.none("UPDATE users SET password = ${newPassword} WHERE username = ${username}", { 
//     username, newPassword 
//   })
// }
module.exports = {
  findUserByUsername, 
  findUserBy: (field, value) => {
    return db.one("SELECT id, username, password, email, display_name, avatar, gender, nationality, firstname, lastname, phone_number, TO_CHAR(birthday, 'dd/mm/yyyy') AS birthday FROM users WHERE ${field:name} = ${value}", {field, value});
  },
  
  findUserByExternalAccountId: (id, provider) => {
    return db.oneOrNone("SELECT users.id, username, password, users.email, users.display_name, gender, nationality, firstname, lastname, phone_number, TO_CHAR(birthday, 'dd/mm/yyyy') AS birthday FROM users JOIN external_accounts ea ON users.id = ea.user_id WHERE ea.profile_id = ${id} AND ea.provider = ${provider}", {id, provider});
  },

  createUser: (user) => {
    return db.one("INSERT INTO users(username,password,email,gender,nationality,display_name) \
    VALUES(${username},${hashedPassword},${email},${gender},${nationality},${displayName}) RETURNING id", user);
  },

  async createUserWithExternalAccount(profile) {
    const user = {
      username: null,
      hashedPassword: null,
      email: profile.emails[0].value,
      gender: "",
      nationality: "",
      displayName: profile.displayName,
    };
    const userId = await this.createUser(user);
    const externalAccountProfile = {
      id: profile.id,
      provider: profile.provider,
      email: profile.emails[0].value,
      displayName: profile.displayName,
      familyName: profile.name.familyName,
      givenName: profile.name.givenName,
    };
    await db.none("INSERT INTO external_accounts (profile_id,provider,email,display_name,family_name,given_name,user_id) VALUES (${profile.id},${profile.provider},${profile.email},${profile.displayName},${profile.familyName},${profile.givenName},${userId.id})", {userId, profile: externalAccountProfile});
    return userId.id;
  },

  updateUser: (user) => {
    return db.none("UPDATE users SET email = ${email}, firstname = ${firstname}, lastname = ${lastname}, display_name = ${displayName}, phone_number = ${phoneNumber}, gender = ${gender}, nationality = ${nationality}, birthday = TO_DATE(${birthday}, 'DD/MM/YYYY'), avatar = ${avatar} WHERE id = ${id}", user);
  }, 
  changePassword: (userId, newPassword) => {
    return db.none("UPDATE users SET password = ${newPassword} WHERE id = ${userId}", { 
      userId, newPassword 
    });
  },
  removeUser: (userId) => {
    return db.none("DELETE FROM users WHERE id = ${userId}", {userId});
  }
};