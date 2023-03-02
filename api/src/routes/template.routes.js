import express from 'express';
import { getTemplate, createTemplate, getTemplates, deleteTemplate, updateTemplate } from '../controllers/template.controller.js';

const templateRoutes = express.Router();

templateRoutes.route('/')
  .get(getTemplates)
  .post(createTemplate);

templateRoutes.route('/:id')
  .get(getTemplate)
  .put(updateTemplate)
  .delete(deleteTemplate);

export default templateRoutes;