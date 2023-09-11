import Joi from 'joi'

const userCreateSchema = Joi.object().keys({
    name: Joi.string().required(),
    forename: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    isadmin: Joi.boolean().default(false),
    status: Joi.boolean().default(true)
});

const userUpdateSchema = Joi.object().keys({
  name: Joi.string().optional(),
  forename: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  isadmin: Joi.boolean().optional(),
  status: Joi.boolean().optional()
});

export default userCreateSchema;
export {userUpdateSchema};
 