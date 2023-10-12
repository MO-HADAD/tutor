import argon from 'argon2';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Response from '../utils/response.js';
import prisma from '../utils/prismaClient.js';
import { createAdminValidation } from '../validations/adminValidation.js'

export const createClient = catchAsync(async (req,res)=>{
    const {firstName, lastName,email,password,phone,coverImage,photo,country,firstMeeting,topics,sessions,resetToken,resetTokenExpires}
     = req.body;
     const { error, value } = createAdminValidation.validate({
        firstName,
        lastName,
        email,
        password,
      });
      if (error) return next(new AppError(error, 400));

      const hashedPassword = await argon.hash(password);

      const newClient = await prisma.Client.create({
        data:{
            firstName,
             lastName,
             email,
             password : hashedPassword,
             phone,
             coverImage,
             photo,
             country,
             firstMeeting,
             topics,
             sessions,
             resetToken,
             resetTokenExpires
        }
      })
      Response(res, 'Client Created.', 201, newClient);
})

// Retrieve all clients
export const getAllClients = catchAsync(async (req, res) => {
 
    const clients = await prisma.Client.findMany();
    Response(res, 'All Clients Retrieved.', 200, clients);
  
});

// Find a client by ID
export const getClientById = catchAsync(async (req, res) => {
  const clientId = req.params.id;
  

 
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    Response(res, 'Client Retrieved by ID.', 200, client);
  
});

// Update a client by ID
export const updateClient = catchAsync(async (req, res) => {
  const clientId = req.params.id;
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    coverImage,
    photo,
    country,
    firstMeeting,
    topics,
    sessions,
    resetToken,
    resetTokenExpires
  } = req.body;

const { error, value } = createAdminValidation.validate({
    firstName,
    lastName,
    email,
    password,
  });
  // if (error) return next(new AppError(error, 400));

  // Hash the password if it's being updated
  const hashedPassword = password ? await argon.hash(password) : undefined;


    const updatedClient = await prisma.Client.update({
      where: { id: clientId },
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        coverImage,
        photo,
        country,
        firstMeeting,
        topics,
        sessions,
        resetToken,
        resetTokenExpires
      },
    });
    Response(res, 'Client Updated.', 200, updatedClient);
  
});


export const deleteClient = catchAsync(async (req, res) => {
  const clientId = req.params.clientId;

 
    await prisma.Client.delete({
      where: { id: clientId },
    });
    Response(res, 'Client Deleted.', 204);
 
});
