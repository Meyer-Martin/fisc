import database from '../config/db.config';
import ResponseFormat from '../domain/responseFormat';
import {Request, Response} from 'express';
import logger from '../util/logger'; 
import QUERY from '../query/server.query';
import serverCreateSchema, { serverUpdateSchema } from '../models/server.model';
import { exec } from 'child_process';
import Server from '../interfaces/server.interface'

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function setData(req: Request) {
    const data: Server = {
      serverName: req.body.serverName,
      serverSize: req.body.serverSize
    };
    return data;
  }
  
function setUpdateData(req: Request, previousValues: Server) {
    const data: Server = {};
    req.body.serverName ? data.serverName = req.body.serverName : data.serverName = previousValues.serverName
    req.body.serverSize ? data.serverSize = req.body.serverSize : data.serverSize = previousValues.serverSize
    data.id = previousValues.id
    return data;
}

export const createServer = async (req: Request, res: Response) => {
    logger.info(`${req.method} ${req.originalUrl}, creating server`);
    // validation du corps de la requête pour voir si ça match avec le modèle de données
    const {error} = serverCreateSchema.validate(req.body);
    if(error) {
        return res.status(HttpStatus.BAD_REQUEST.code).send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
    }
    // Create server on scaleway
    const terraformCommand = `cd terraform && \ terraform init && \ terraform apply -var="vm_name_pfx"=${req.body.serverName} -var="vm_size"=${req.body.serverSize} -lock=false -auto-approve`;
    exec(terraformCommand, (err:any, stdout:any, stderr:any) => {
        logger.info(stdout)
        if(err) {
            logger.error(err)
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occured`));
        }
   })
   // Add server to DB
   try {
        const data = setData(req);
        await database.query(QUERY.CREATE_SERVER, Object.values(data))

        res.status(HttpStatus.CREATED.code)
            .send(new ResponseFormat(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Server created`));
    } catch (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
    }
};

export const getServers = async (req : Request, res: Response) =>  {
  logger.info(`${req.method} ${req.originalUrl}, fetching servers`); 
  try {
    const result = await database.query(QUERY.SELECT_SERVERS)
    const rows : Array<Server> = Object.values(result[0]);

    if(rows.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `No servers found`));
    }
    
    const servers = rows.map((row : Server) => ({
      id: row.id,
      serverName: row.serverName,
      serverSize: row.serverSize
    }));

    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Servers retrieved`, { servers: servers }));

  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const getServer = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching server`);
  try {
    const result = await database.query(QUERY.SELECT_SERVER, req.params.id)
    const rows : Array<Server> = Object.values(result[0]);

    if(rows.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Server by id ${req.params.id} was not found`));
    }

    const server = rows.map((row : Server) => ({
      id: row.id,
      serverName: row.serverName,
      serverSize: row.serverSize
    }));

    res.status(HttpStatus.OK.code)
    .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Server retrieved`, { server : server }));
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  } 
};

export const updateServer = async (req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, update server`);
  const { error } = serverUpdateSchema.validate(req.body);
  if (error) {
    return res.status(HttpStatus.BAD_REQUEST.code)
      .send(new ResponseFormat(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
  }
  // TODO add update for scaleway
  try {
    const result = await database.query(QUERY.SELECT_SERVER, req.params.id)
    const selectResult : Array<Server> = Object.values(result[0]);
    if(selectResult.length === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Server by id ${req.params.id} was not found`));
    }
    logger.info(selectResult[0])
    const data = setUpdateData(req, selectResult[0]);
    await database.query(QUERY.UPDATE_SERVER, Object.values(data))
    res.status(HttpStatus.OK.code)
        .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Server updated`));
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export const deleteServer = async(req: Request, res: Response) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting server`);
  // TODO add delete for scaleway
  try {
    const result = await database.query(QUERY.DELETE_SERVER, req.params.id)
    if(result[0] && 'affectedRows' in result[0] && result[0].affectedRows === 0) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new ResponseFormat(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Server by id ${req.params.id} was not found`));
    }
    res.status(HttpStatus.OK.code)
      .send(new ResponseFormat(HttpStatus.OK.code, HttpStatus.OK.status, `Server deleted`));
  } catch(err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new ResponseFormat(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occurred`));
  }
};

export default HttpStatus;
