import  express  from "express";

import { createClient, deleteClient, getAllClients, getClientById, updateClient } from "../controllers/clientController.js";

const clientRouter = express.Router();

clientRouter.post('/',createClient);
clientRouter.get('/',getAllClients);
clientRouter.get('/:id',getClientById);
clientRouter.put('/:id',updateClient);
clientRouter.delete('/:id',deleteClient);



export default clientRouter;
