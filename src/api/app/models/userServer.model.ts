import Joi from 'joi'

const userServerCreateSchema = Joi.object().keys({
    user_id: Joi.number().required(),
    server_id: Joi.number().required()
});

export default userServerCreateSchema;
 