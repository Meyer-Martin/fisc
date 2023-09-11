import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import {Request, Response} from 'express';
import logger from '../util/logger'; 
import QUERY from '../query/userServer.query';
import userServerCreateSchema from '../models/userServer.model';
import UserServer from '../interfaces/userServer.interface';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function setData(req: Request) {
  const data: UserServer = {
    server_id: req.body.server_id,
    user_id: req.body.user_id,
  };
  return data;
}

export const createUserServer = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating userServer`);
  const { error } = userServerCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const data = setData(req);
    await database.query(QUERY.CREATE_USERSERVER, Object.values(data))

    res.status(HttpStatus.CREATED.code)
      .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `UserServer created`));
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsersServers = async (req : Request, res: Response) =>  {
  logger.info(`${req.method} ${req.originalUrl}, fetching usersServers`);
  try {
    const result = await database.query(QUERY.SELECT_USERSSERVERS)
    const rows : Array<UserServer> = Object.values(result[0]);

    if(rows.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No usersServers found`));
    }
    
    const usersServers = rows.map((row : UserServer) => ({
      id: row.id,
      user_id: row.user_id,
      server_id: row.server_id
    }));

    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UsersServers retrieved`, { usersServers: usersServers }));

  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUserServer = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  try {
    const result = await database.query(QUERY.SELECT_USERSERVER, req.params.id)
    const rows : Array<UserServer> = Object.values(result[0]);

    if(rows.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `UserServer by id ${req.params.id} was not found`));
    }

    const userServer = rows.map((row : UserServer) => ({
      id: row.id,
      user_id: row.user_id,
      server_id: row.server_id
    }));

    res.status(HttpStatus.OK.code)
    .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UserServer retrieved`, { userServer : userServer }));
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

export const deleteUserServer = async(req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting userServer`);
  try {
    const result = await database.query(QUERY.DELETE_USERSERVER, req.params.id)
    if(result[0] && 'affectedRows' in result[0] && result[0].affectedRows === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `UserServer by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `UserServer deleted`));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
