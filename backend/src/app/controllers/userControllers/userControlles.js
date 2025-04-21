/*
lets create a controller for user
this.controller will handle all the usr related operations 
1 - Get all users
2 - Get user by Id
3 - Create user
4 - Authentication
5 - Create the functions of the generated JWT and decryption
6 - Update user
7 - Delete user
8 - Show user use
*/
const userSchema = require("../../db/schemas/userSchema");
const RefreshToken = require("../../db/schemas/refreshTokenSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const cookieParser = require("cookie-parser"); // Necesitarás este middleware en tu app Express
const countIntentosSchemas = require("../../db/schemas/countIntentoSchema");
const countSchemas = require("../../db/schemas/countSchema");

const UserAdd = async (request, response) => {
  const { name, email, password } = request.body;

    request.body.password = await bcrypt.hash(password, 10);
    const user = new userSchema(request.body);
    const userFind = await userSchema.findOne({ email });
    if (userFind) {
      return response.status(409).json({
        message: "User already exists",
      });
    } else {
      user
        .save()
        .then((user) => {
          response.status(201).json({
            message: "User created successfully",
            data: user,
          });
        })
        .catch((error) => {
          response.status(500).json({
            message: "Sorry, by the server you entered an error",
            error: error.message,
          });
        });
    }
  
  
};

const getAllUsers = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split("Bearer ")[1].trim();
  jwt.verify(token, process.env.JWT_SECRET,async  (error, decoded) => {
    const { _id } = decoded;
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
    
   await userSchema.find({ _id })
   .then(result => {
    response.status(200).json({
      message: "All users found",
      data: result,
    });
   }).catch(error => {
      return response.status(404).json({
        message: "No users found",
      });
   })
    //console.log(AllUsers)
    
    
  });
};

const getUserById = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split("Bearer ")[1].trim();
  const { id } = request.params;
  console.log(id)
  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
     await userSchema.findById({
      _id: id
    }).select('-password').then((result) => {
     
      response.status(200).json({
        message: "User found",
        data: result,
      });
    }).catch(error => {
      return response.status(404).json({
        message: "User not found",
      });
    })

    
  });
};

const updateUser = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split("Bearer ")[1].trim();
  const { id } = request.params;
  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
    const user = await userSchema.findById(id);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    } else {
      const updatedUser = await userSchema.findByIdAndUpdate(id, request.body, {
        new: true,
      }).select("-password");
      response.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
      });
    }
  });
};

const deleteUser = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split("Bearer ")[1].trim();
  const { id } = request.params;
  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }

    const user = await userSchema.deleteOne({ _id: id });
    if (user.deletedCount === 0) {
      return response.status(404).json({
        message: "User not found",
      });
    } else {
      response.status(200).json({
        message: "User deleted successfully",
      });
    }
  });
};

const authenticateUser = async (request, response) => {
  try {
    const { email, password } = request.body;

    // 1. Buscar usuario por email usando el MODELO
    const userAuth = await userSchema.findOne({ email });

    if (!userAuth) {
      // Usar return para detener la ejecución
      return response.status(401).json({
        message: "Invalid credentials", // Mensaje genérico
      });
    }

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, userAuth.password);
    const countFind = await countIntentosSchemas.findOne({
      userId: userAuth._id,
    });
    const countS = await countSchemas.findOne({ userId: userAuth._id });
    if (!isMatch) {
      if (countS === null) {
        const countSave = new countSchemas({
          userId: userAuth._id,
          count: 1,
        });
        await countSave.save();
        console.log("Here lest go new count");
      } else {
        await countSchemas.updateOne(
          { userId: userAuth._id, count: { $lt: 5 } },
          {
            $inc: { count: 1 },
          }
        );
      }
      if (countS != null) {
        console.log(countS.count === 5);
        if (countS.count === 5) {
          const date = new Date();
          const hora = 60 * 60 * 2;
          if (!countFind) {
            const countIntentos = new countIntentosSchemas({
              time: new Date(date.getTime() + hora * 1000).toString(),
              userId: userAuth._id,
            });
            await countIntentos.save();
          }
          return response.status(401).json({
            message:
              "Has alcanzado el límite máximo de intentos permitidos (6). Debes esperar 2 horas antes de volver a intentarlo.", // Mensaje genérico
          });
        }
      }

      return response.status(401).json({
        message: "Invalid credentials", // Mensaje genérico,
      });
    }

    if (countFind !== null) {
      const actualDate = new Date().getTime();
      const countFindDate = new Date(countFind.time).getTime();
      if (actualDate >= countFindDate) {
        await countIntentosSchemas.deleteOne({ userId: userAuth._id });
        // Usar return para detener la ejecución
      } else {
        return response.status(401).json({
          message:
            "¡Ups! Su cuenta está bloqueada por ahora. Espere dos horas y podrá volver a intentarlo.", // Mensaje genérico
        });
      }
    }
    // --- Autenticación Exitosa ---

    // 3. Generar Payloads (mínimos y claros)
    const userDataToSend = {
      _id: userAuth._id, // Cambiado de name a _id
      name: userAuth.name, // Añadido si lo necesitas
      email: userAuth.email,
      role: userAuth.role,
      // Solo incluye lo que el frontend realmente necesita
    }; // Usar _id directamente
    const refreshTokenPayload = userDataToSend;

    // 4. Generar Tokens (UNA SOLA VEZ cada uno)
    const accessToken = jwt.sign(userDataToSend, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
      algorithm: process.env.JWT_ALGORITHM,
    });

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      }
    );

    // 5. Guardar Refresh Token en BD (usando async/await y try/catch)
    try {
      const expiryDate = new Date(
        Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRATION)
      );
      // Borrar tokens viejos del mismo usuario si es necesario (opcional pero recomendado)
      // await RefreshToken.deleteMany({ userId: userAuth._id });

      const newRefreshToken = new RefreshToken({
        userId: userAuth._id,
        token: refreshToken, // Considera hashear este token antes de guardarlo
        expiresAt: expiryDate,
      });
      await newRefreshToken.save(); // Espera a que se guarde
    } catch (dbError) {
      console.error("Error saving refresh token:", dbError);
      // ¡Enviar respuesta de error si falla el guardado!
      return response
        .status(500)
        .json({ message: "Failed to process login (DB)." });
    }

    // 6. Establecer la Cookie HttpOnly para el Refresh Token
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // O 'Lax'
      maxAge: ms(process.env.REFRESH_TOKEN_EXPIRATION),
    });

    // 7. Preparar datos seguros del usuario para enviar (sin contraseña, etc.)

    await countIntentosSchemas.deleteOne({ userId: userAuth._id });
    await countSchemas.deleteOne({ userId: userAuth._id });
    // 8. Enviar la Respuesta Final con el Access Token correcto
    return response.status(200).json({
      message: "User authenticated successfully",
      data: userDataToSend,
      accessToken: accessToken, // Usa el PRIMER accessToken generado
    });
  } catch (error) {
    // Catch general para otros errores inesperados (ej. error en jwt.sign)
    console.error("Error during authentication process:", error);
    // Verifica si las cabeceras ya se enviaron antes de intentar enviar de nuevo
    if (!response.headersSent) {
      return response
        .status(500)
        .json({ message: "Internal server error during login." });
    }
  }
};

const showUserUse =  async (request, response) =>{
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split("Bearer ")[1].trim();
  jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
    const user = await userSchema.findOne({ _id: decoded._id });
    delete user.password;
    if (user.deletedCount === 0) {
      return response.status(404).json({
        message: "User not found",
      });
    } else {
      response.status(200).json({
        message: "User find successfully",
        user :  {
          "_id": user._id,
          "name": user.name,
          "email": user.email,
          "role": user.role,
          "createdAt": user.createdAt,
          "updatedAt": user.updatedAt,
          "__v": 0
        }
      });
    }
  });
}

const searchUserEmail = async (request, response) => {
    const { email } = request.body;
        console.log(email);
        userSchema
        .findOne({ email: { $regex: email, $options: 'i' } }).select('-password')
        .then((user) => {
            if (user.length === 0) {
                return response.status(404).json({
                    message: 'User not found'
                });
            }
            response.status(200).json({
                message: 'User retrieved successfully',
                user
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
                message: 'Error retrieving user',
                error: error.message
            });
        });
    
}

const updatepassword = async (request, response) => {
    const { id } = request.params;
    const { password } = request.body;
    const user = await userSchema.findById(id);
    if (!user) {
      return response.status(404).json({
        message: "User not found",
      });
    } else {
      request.body.password = await bcrypt.hash(password, 10);
      const updatedUser = await userSchema.findByIdAndUpdate(id,  request.body, {
        new: true,
      }).select("-password");
      response.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
      });
    }
 
};

module.exports = { UserAdd, getAllUsers, authenticateUser, getUserById, updateUser, deleteUser,showUserUse,searchUserEmail, updatepassword};
