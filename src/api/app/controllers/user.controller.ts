import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import {Request, Response} from 'express';
import logger from '../util/logger'; 
import QUERY from '../query/user.query';
import userCreateSchema, { userUpdateSchema } from '../models/user.model';
import User from '../interfaces/user.interface';
import jwt from 'jsonwebtoken';
//import {storePassword, retrievePassword} from "../util/vault-service"

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
    isadmin: req.body.isadmin,
    status: req.body.status
  };
  return data;
}

function setUpdateData(req: Request, previousValues: User) {
  const data: User = {};
  req.body.name ? data.name = req.body.name : data.name = previousValues.name
  req.body.forename ? data.forename = req.body.forename : data.forename = previousValues.forename
  req.body.email ? data.email = req.body.email : data.email = previousValues.email
  req.body.password ? data.password = req.body.password : data.password = previousValues.password
  req.body.isadmin ? data.isadmin = req.body.isadmin : data.isadmin = previousValues.isadmin
  req.body.status ? data.status = req.body.status : data.status = previousValues.status
  data.id = previousValues.id
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
    const secretKey = process.env.SECRET_KEY || "secretkey"
    logger.info(secretKey)
    if(data.email && data.password) {
      //await storePassword(data.email, data.password); COMMENTE BONUX MAITE
      const token = jwt.sign({
        id: data.id,
        email: data.email,
        isadmin: data.isadmin
      }, secretKey, { expiresIn: '3 hours' })
      await database.query(QUERY.CREATE_USER, Object.values(data))

      res.status(HttpStatus.CREATED.code)
        .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User created`, {token : token}));
    }
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getUsers = async (req : Request, res: Response) =>  {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  try {
    const result = await database.query(QUERY.SELECT_USERS)
    const rows : Array<User> = Object.values(result[0]);

    if(rows.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No users found`));
    }
    
    const users = rows.map((row : User) => ({
      id: row.id,
      name: row.name,
      forename: row.forename,
      email: row.email,
      isadmin: row.isadmin,
      status: row.status
    }));

    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Users retrieved`, { users: users }));

  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const login = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, login`);

  // Récupérez le mot de passe stocké dans Vault pour cet utilisateur
  //const storedPassword = await retrievePassword(email);

  // Vérifiez si le mot de passe correspond
  //if (password === storedPassword) {

  const secretKey = process.env.SECRET_KEY || "secretkey"
  if (req.body.password == req.body.password) {
    // Générez un token JWT
    const token = jwt.sign(req.body.email , secretKey);

    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Login succes`, { token }));
  } else {
    res.status(401)
      .send(new ResponseFormat(401, "Unauthorized", "Authentication failed"));
  }
}

export const getUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching user`);
  try {
    const result = await database.query(QUERY.SELECT_USER, req.params.id)
    const rows : Array<User> = Object.values(result[0]);

    if(rows.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }

    const user = rows.map((row : User) => ({
      id: row.id,
      name: row.name,
      forename: row.forename,
      email: row.email,
      isadmin: row.isadmin,
      status: row.status
    }));

    res.status(HttpStatus.OK.code)
    .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User retrieved`, { user : user }));
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

export const updateUser = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, update user`);
  const { error } = userUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  try {
    const result = await database.query(QUERY.SELECT_USER, req.params.id)
    const selectResult : Array<User> = Object.values(result[0]);

    if(selectResult.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    logger.info(selectResult[0])
    const data = setUpdateData(req, selectResult[0]);

    await database.query(QUERY.UPDATE_USER, Object.values(data))
    res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User updated`));
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteUser = async(req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting user`);
  try {
    const result = await database.query(QUERY.DELETE_USER, req.params.id)
    if(result[0] && 'affectedRows' in result[0] && result[0].affectedRows === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `User deleted`));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
