import express from 'express';
import { getUser, createUser, getUsers, deleteUser, updateUser } from '../controllers/user.controller';

const userRoutes = express.Router();

userRoutes.route('/')
  .get(getUsers)
  .post(createUser);

userRoutes.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default userRoutes;