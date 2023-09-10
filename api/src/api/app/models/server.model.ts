import Joi from 'joi'

const serverCreateSchema = Joi.object().keys({
    serverCount: Joi.number().required(),
    // add servers' names
});

export default serverCreateSchema;
 