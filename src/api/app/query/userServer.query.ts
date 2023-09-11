const QUERY = {
    SELECT_USERSSERVERS: 'SELECT * FROM userServer',
    SELECT_USERSERVER: 'SELECT * FROM userServer WHERE id = ?',
    CREATE_USERSERVER: 'INSERT INTO userServer(user_id, server_id) VALUES (?, ?)',
    DELETE_USERSERVER: 'DELETE FROM userServer WHERE id = ?',
  };
  
  export default QUERY;