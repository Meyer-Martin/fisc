const QUERY = {
    SELECT_USERS: 'SELECT * FROM user',
    SELECT_USER: 'SELECT * FROM user WHERE id = ?',
    SELECT_USER_BY_EMAIL: 'SELECT * FROM user WHERE email = ?',
    CREATE_USER: 'INSERT INTO user(name, forename, email, password, isadmin, status) VALUES (?, ?, ?, ?, ?, ?)',
    UPDATE_USER: 'UPDATE user SET name = ?, forename = ?, email = ?, password= ?, isadmin= ?, status=? WHERE id = ?',
    DELETE_USER: 'DELETE FROM user WHERE id = ?',
  };
  
  export default QUERY;