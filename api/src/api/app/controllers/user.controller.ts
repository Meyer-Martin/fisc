import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import {Request, Response} from 'express';
import logger from '../util/logger'; 
import QUERY from '../query/user.query';
import userCreateSchema, { userUpdateSchema } from '../models/user.model';
import User from '../interfaces/user.interface'

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function setData(req: Request) {
  const data: User = {
    name: req.body.name,
    forename: req.body.forename,
    email: req.body.email,
    password: req.body.password,
  };
  return data;
}

function setUpdateData(req: Request, previousValues: User) {
  const data: User = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues.name
  req.body.forename ? data.forename = req.body.forename : data.forename = previousValues.forename
  req.body.email ? data.email = req.body.email : data.email = previousValues.email
  req.body.password ? data.password = req.body.password : data.password = previousValues.password
  return data;
}

export const createUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, creating user`);
  const { error } = userCreateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const data = setData(req);
    database.query(QUERY.CREATE_USER, Object.values(data), (err: any) => {
      if(err) {
        logger.info(err)
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      }
      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User created`));
    });
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsers = async (req : Request, res: Response) =>  {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  database.query(QUERY.SELECT_USERS, (err: any, result: Array<User>) => {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }
    if(result.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }

    const users = result.map((row) => ({
      name: row.name,
      forename: row.forename,
      email: row.email,
      password: row.password,
    }));

    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users: users }));
  });
};

export const getUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  database.query(QUERY.SELECT_USER, req.params.id, (err: any, result: User) => {
    if(!result) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }

    return res.status(HttpStatus.OK.code)
    .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User retrieved`, { result }));
  });  
};

export const updateUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
 
  database.query(QUERY.SELECT_USER, req.params.id, (err: any, selectResult: User) => {
    if(!selectResult) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    if(err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }

    const data = setUpdateData(req, selectResult);
    database.query(QUERY.UPDATE_USER, Object.values(data), (err2: any) => {
      if(err2) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
      }
      res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User updated`));
    });
  });

};

export const deleteUser = async(req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user`);
  database.query(QUERY.DELETE_USER, req.params.id, (err: any, result: User) => {
    if(!result) {
      return res.status(HttpStatus.NOT_FOUND.code)
      .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    if(err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
    .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }
    return res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User deleted`));
  });
};

export default HttpStatus;
