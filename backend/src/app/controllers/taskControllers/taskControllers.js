/*
 1 - Create a task
 2 - Get all tasks
 3 - Get a task by Id
 4 - Update a task by Id
 5 - Delete a task by Id
 6 - Search tasks by title
 7 - Search tasks by status
*/

const taskSchema = require("../../db/schemas/taskSchema");
const jwt = require("jsonwebtoken");

// 1 - Create a task
const createTask = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split('Bearer ')[1].trim();
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }

    console.log(decoded._id);
    request.body.userId = decoded._id;
    const task = new taskSchema(request.body);
    task
      .save()
      .then(() => {
        response.status(201).json({
          message: "Task created successfully",
          task: task,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).json({
          message: "Error creating task",
          messageFinish: error.message
        });
      });
  });
};

const getAllTasks = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split('Bearer ')[1].trim();
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return response.status(401).json({
        message: "Unauthorized",
        error: error.message,
      });
    }
    console.log(decoded)
    taskSchema
      .find({userId : decoded._id })
      .then((tasks) => {
        response.status(200).json({
          message: "Tasks retrieved successfully",
          tasks: tasks,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).json({
          message: "Error retrieving tasks",
          error: error.message,
        });
      });
  });
};

// 3 - Get a task by Id
const getTaskId = async (request, response) => {
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
     console.log(decoded._id)
    taskSchema
      .findOne({_id : id, userId : decoded._id })
      .then((task) => {
        if (!task) {
          return response.status(404).json({
            message: "Task not found",
          });
        }
        response.status(200).json({
          message: "Task retrieved successfully",
          task: task,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).json({
          message: "Error retrieving task",
          error: error.message,
        });
      });
  });
};
// 4 - Update a task by Id
const updateTaskId = async (request, response) => {
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
    taskSchema
      .findByIdAndUpdate(id, request.body, { new: true })
      .then((task) => {
        if (!task) {
          return response.status(404).json({
            message: "Task not found",
          });
        }
        response.status(200).json({
          message: "Task updated successfully",
          task: task,
        });
      })
      .catch((error) => {
        console.log(error);
        response.status(500).json({
          message: "Error updating task",
          error: error.message,
        });
      });
  });
};

const deleteTaskId =  async (request, response) => {
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
        taskSchema
        .findByIdAndDelete(id)
        .then((task) => {
            if (!task) {
            return response.status(404).json({
                message: "Task not found",
            });
            }
            response.status(200).json({
            message: "Task deleted successfully"
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
            message: "Error deleting task",
            error: error.message,
            });
        });
    });
}

// 6 - Search tasks by title
const searchTaskTitle = async (request, response) => {
    const bearer = request.headers["authorization"];
    if(!String(bearer).includes('Bearer')){
      return response.status(401).json({
        message: "Ups",
        error: 'Sorry, you need authorizations',
      });
    }
    const token = String(bearer).split('Bearer ')[1].trim();
    const { title } = request.body;
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return response.status(401).json({
                message: 'Unauthorized',
                error: error.message
            });
        }
        taskSchema
        .find({userId : decoded._id , title: { $regex: title, $options: 'i' } })
        .then((tasks) => {
            if (tasks.length === 0) {
                return response.status(404).json({
                    message: 'Task not found'
                });
            }
            response.status(200).json({
                message: 'Tasks retrieved successfully',
                tasks: tasks
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
                message: 'Error retrieving tasks',
                error: error.message
            });
        });
    });
}

// 7 - Search tasks by status
const searchStatus = async (request, response) => {
  const bearer = request.headers["authorization"];
  if(!String(bearer).includes('Bearer')){
    return response.status(401).json({
      message: "Ups",
      error: 'Sorry, you need authorizations',
    });
  }
  const token = String(bearer).split('Bearer ')[1].trim();
    const { status } = request.body;
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if(error){
            return response.status(401).json({
                message: 'Unauthorized',
                error: error.message
            });
        }
        taskSchema.find({userId : decoded._id ,status: { $regex: status, $options: 'i'}})
        .then((tasks) => {
            
            if(tasks.length === 0){
                return response.status(404).json({
                    message: 'Task not found'
                });
            }
            response.status(200).json({
                message: 'Tasks retrieved successfully',
                tasks: tasks
            });
        })
        .catch((error) => {
            console.log(error);
            response.status(500).json({
                message: 'Error retrieving tasks',
                error: error.message
            });
        });
    });
}


module.exports = { createTask, getAllTasks, searchStatus, searchTaskTitle, deleteTaskId, updateTaskId, getTaskId};
