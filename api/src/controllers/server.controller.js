import Response from '../domain/response.js';
import logger from '../util/logger.js'; 
import serverCreateSchema from '../models/server.model.js';
import { spawn } from 'child_process';

import config from './config.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

function createScalewayServers(serverCount, imageId) {
  // Vérification de l'existence de l'image
  const result = execSync(`terraform init && terraform workspace select ${imageId} && terraform refresh -target=scaleway_image.example && terraform state show scaleway_image.example`, { encoding: 'utf-8' });
  // Si l'image n'existe pas, renvoie une erreur 404
  if (!result.includes(`id = "${imageId}"`)) {
    return res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, "Image with id : " + imageId + " not found"));
  }
  return new Promise((resolve, reject) => {
    try {
      const cmd = spawn('terraform', ['apply', '-var', `server_count=${serverCount}, '-var', image_id=${imageId}`], {
        cwd: '/path/to/terraform/directory' // mettre le path du packer
      });
      resolve()
    } catch(err) {
      reject(err);
    } 
  });
}

export const createTemplate = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, creating template`);
   // validation du corps de la requête pour voir si ça match avec le modèle de données
   const {error} = serverCreateSchema.validate(req.body);
   if(error) {
     return res.status(HttpStatus.BAD_REQUEST.code).send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, error.details[0].message));
   }
  try {
    createScalewayServers(req.body.serverCount, req.body.imageId)
  } catch(err) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, `Error occured`));
  }
  res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Template OK`));
};

export const getTemplates = async (req, res) =>  {
  logger.info(`${req.method} ${req.originalUrl}, fetching template`); 
  res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Template OK`));
};

export const getTemplate = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching template`);
  res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Template OK`));
};

export const updateTemplate = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching template`);
  res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Template OK`));
};

export const deleteTemplate = async(req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, deleting template`);
  res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Template OK`));
};

export default HttpStatus;
