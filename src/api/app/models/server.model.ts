import Joi from 'joi'

const serverCreateSchema = Joi.object().keys({
    serverName : Joi.string().default("nextcloud_server"),
    serverSize : Joi.number().default(20)
});

const serverUpdateSchema = Joi.object().keys({
    serverName : Joi.string().optional(),
    serverSize : Joi.number().optional()
});

export default serverCreateSchema;
export {serverUpdateSchema};