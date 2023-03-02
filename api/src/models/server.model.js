import Joi from 'joi'

const serverCreateSchema = Joi.object().keys({
    serverCount: Joi.number().required(),
    imageId: Joi.string().required()
});

export default serverCreateSchema;
 