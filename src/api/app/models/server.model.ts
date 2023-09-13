import Joi from 'joi'

const serverCreateSchema = Joi.object().keys({
    serverName : Joi.string().default("nextcloud_server"),
    serverSize : Joi.number().default(20),
    user_id: Joi.number().required()
});

const serverUpdateSchema = Joi.object().keys({
    serverName : Joi.string().optional(),
    serverSize : Joi.number().optional(),
    user_id: Joi.number().optional()
});

export default serverCreateSchema;
export {serverUpdateSchema};