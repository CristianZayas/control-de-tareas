const { home, homeList } = require('../controllers/homeControllers/home');
const { UserAdd,getAllUsers, authenticateUser, showUserUse,
    updateUser, deleteUser,getUserById, searchUserEmail, updatepassword
} = require('../controllers/userControllers/userControlles');
const { createTask, getAllTasks,searchStatus,
    searchTaskTitle, deleteTaskId, updateTaskId, getTaskId
} =  require('../controllers/taskControllers/taskControllers');
const {
    addingProject,
    updateProject,
    searchprojectTitle,
    deleteprojectId,
    getprojectId,
    getAllProjectId
} = require('../controllers/project/projectController');
const { verifytoken } = require('../controllers/verify-token/verify_token_controllers');
const { refreshTokenHandler } = require('../controllers/userControllers/refresh');

const router = require('express').Router();
//TODO: Add all the touters methods here get
router.get('/', home);
router.get('/home/:id', homeList); // This allow by practice
router.get('/user/:id', getUserById); // ✅ No le veo utilidad por el momento
router.get('/task/:id', getTaskId); // ✅✅
router.get('/project/:id', getprojectId);
router.get('/user-list', getAllUsers);// ✅
router.get('/tasks-list', getAllTasks); // ✅
router.get('/show-user', showUserUse); // ✅
router.get('/projects', getAllProjectId); // ✅
router.get('/verify-token', verifytoken); // ✅✅✅

//TODO: Add all the routers methods here post
router.post('/user',UserAdd);// ✅✅
router.post('/authenticate',authenticateUser); // ✅✅✅
router.post('/task', createTask); // ✅
router.post('/project', addingProject); // ✅
router.post('/tasks-search-title', searchTaskTitle); // ✅
router.post('/tasks-search-status', searchStatus); // ✅
router.post('/user-search-email', searchUserEmail); // ✅
router.post('/project-search', searchprojectTitle); // ✅
router.post('/auth/refresh', refreshTokenHandler); // ✅ 
//TODO: Add all the routers methods here put
router.put('/user/:id', updateUser); // ✅
router.put('/task/:id', updateTaskId);  // ✅
router.put('/project/:id', updateProject); // ✅
router.put('/reset-password/:id', updatepassword); // ✅
//TODO: Add all the routers methods here delete
router.delete('/user/:id', deleteUser); // ✅
router.delete('/task/:id', deleteTaskId); // ✅
router.delete('/project/:id', deleteprojectId); // ✅
module.exports = router;