const QUERY = {
    SELECT_SERVERS: 'SELECT * FROM server',
    SELECT_SERVER: 'SELECT * FROM server WHERE id = ?',
    CREATE_SERVER: 'INSERT INTO server(serverName, serverSize) VALUES (?, ?)',
    UPDATE_SERVER: 'UPDATE server SET serverName = ?, serverSize = ? WHERE id = ?',
    DELETE_SERVER: 'DELETE FROM server WHERE id = ?',
  };
  
  export default QUERY;