const QUERY = {
    SELECT_USERS: 'SELECT * FROM user',
    SELECT_USER: 'SELECT * FROM user WHERE id = ?',
    CREATE_USER: 'INSERT INTO user(name, forename, email, password) VALUES (?, ?, ?, ?)',
    UPDATE_USER: 'UPDATE user SET name = ?, forename = ?, email = ?, password= ? WHERE id = ?',
    DELETE_USER: 'DELETE FROM user WHERE id = ?',
  };
  
  export default QUERY;