import express from 'express';
import { getUserServer, createUserServer, getUsersServers, deleteUserServer } from '../controllers/userServer.controller';
const userServerRoutes = express.Router();

userServerRoutes.route('/')
  .get(getUsersServers)
  .post(createUserServer);

  userServerRoutes.route('/:id')
  .get(getUserServer)
  .delete(deleteUserServer);

export default userServerRoutes;