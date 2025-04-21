/*
 1 - Create new projects
 2 - Update projects
 3 - Search a projects
 4 - One project
 5 - Delete a projects
*/
const projectSchema =  require('../../db/schemas/projectSchema');
const jwt = require('jsonwebtoken');

const addingProject = (request, response ) => {
  const bearer = request.headers['authorization'];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token =  String(bearer).split('Bearer')[1].trim();
  const { body } =  request;
  jwt.verify(token,process.env.JWT_SECRET, async (error, decoded) => {
    if(error){
        return response.status(401).json({
            message: "Unauthorized",
            error: error.message,
          });
    };
    const newProject = {
      name: body.name,
      userId: decoded._id
    }
    const project = await  new projectSchema(newProject);
   await project.save()
    .then((resultProject) => {
       return response.status(201).json({
        message : "Project created successfully",
        resultProject
       })
    })
    .catch((error) => {
        return response.status(500).json({
            message: "Unauthorized",
            error: error.message,
        })
    })
  })
}

const updateProject = (request, response) => {
    const bearer = request.headers['authorization'];
    if(!String(bearer).includes('Bearer')){
      return response.status(401).json({
        message: "Ups",
        error: 'Sorry, you need authorizations',
      });
    }
    const token =  String(bearer).split('Bearer')[1].trim();
    const { body } =  request;
    const {id} = request.params;
    jwt.verify(token,process.env.JWT_SECRET, async (error, decoded) => {
      if(error){
          return response.status(401).json({
              message: "Unauthorized",
              error: error.message,
            });
      };
      await projectSchema.findByIdAndUpdate(id,body,{new: true}).then((project) => {
        if (!project) {
          return response.status(404).json({
            message: "project not found",
          });
        }
        response.status(200).json({
          message: "project updated successfully",
          project: project,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).json({
          message: "Error updating project",
          error: error.message,
        });
      });
    });
}

const searchprojectTitle = async (request, response) => {
    const bearer = request.headers["authorization"];
    if(!String(bearer).includes('Bearer')){
      return response.status(401).json({
        message: "Ups",
        error: 'Sorry, you need authorizations',
      });
    }
    const token = String(bearer).split('Bearer ')[1].trim();
    const { name } = request.body;
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                message: 'Unauthorized',
                error: error.message
            });
        }
        projectSchema
        .find({userId : decoded._id , name: { $regex: name, $options: 'i' } })
        .then((projects) => {
            if (projects.length === 0) {
                return response.status(404).json({
                    message: 'project not found'
                });
            }
            response.status(200).json({
                message: 'projects retrieved successfully',
                projects: projects
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
                message: 'Error retrieving projects',
                error: error.message
            });
        });
    });
}

const deleteprojectId =  async (request, response) => {
    const bearer = request.headers["authorization"];
    if(!String(bearer).includes('Bearer')){
      return response.status(401).json({
        message: "Ups",
        error: 'Sorry, you need authorizations',
      });
    }
    const token = String(bearer).split('Bearer ')[1].trim();
    const { id } = request.params;
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
        return response.status(401).json({
            message: "Unauthorized",
            error: error.message,
        });
        }
        projectSchema
        .findByIdAndDelete(id)
        .then((project) => {
            if (!project) {
            return response.status(404).json({
                message: "project not found",
            });
            }
            response.status(200).json({
            message: "project deleted successfully",
            project: project,
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
            message: "Error deleting project",
            error: error.message,
            });
        });
    });
}

const getprojectId = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split('Bearer ')[1].trim();
  const { id } = request.params;
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
     console.log(decoded)
    projectSchema
      .findOne({_id: id,userId : decoded._id })
      .then((project) => {
        if (!project) {
          return response.status(404).json({
            message: "project not found",
          });
        }
        response.status(200).json({
          message: "project retrieved successfully",
          project: project,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).json({
          message: "Error retrieving project",
          error: error.message,
        });
      });
  });
};

const getAllProjectId = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split('Bearer ')[1].trim();
  const { id } = request.params;
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
     console.log(decoded)
    projectSchema
      .find({userId : decoded._id})
      .then((project) => {
        if (!project) {
          return response.status(404).json({
            message: "project not found",
          });
        }
        response.status(200).json({
          message: "project retrieved successfully",
          project: project,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).json({
          message: "Error retrieving project",
          error: error.message,
        });
      });
  });
};

module.exports = {
    addingProject,
    updateProject,
    searchprojectTitle,
    deleteprojectId,
    getprojectId,
    getAllProjectId
}