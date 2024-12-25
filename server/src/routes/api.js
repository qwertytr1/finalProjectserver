const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js'); // Предположим, что ваши контроллеры здесь
const {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require('../controllers/controller.js');
const searchController = require('../controllers/searchController');
const { body } = require('express-validator');
const commentsController = require('../controllers/commentsController.js');
const authMiddleware = require('../middleware/auth-middleware.js');
const checkAdmin = require('../middleware/role-middleware');
const questionController = require('../controllers/questionController.js');
const formsController = require('../controllers/formsControlleer.js')
const answerController = require('../controllers/answersController.js')
const settingsController = require('../controllers/settingsController.js');
const likeController = require('../controllers/likeController.js');
const tagsController = require('../controllers/tagsController.js');
const upload = require('../middleware/upload.js');
const statisticController = require('../controllers/statisticController.js');
const checkTemplates = require('../middleware/templates-middleware.js')
const homeController = require('../controllers/mainPageController.js')
//auth//+
router.post('/register', body('email').isEmail(), authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.post('/refresh-access', authController.refreshAccessToken);

//Users//+
router.get('/getUsers', authController.getAllUsers);
router.get('/getUsers/:id?', authController.getUser);
router.put('/user/:id', authController.editUser);
router.post('/user/block/:id',checkAdmin, authController.toggleBlock);
router.post('/user/unblock/:id',checkAdmin, authController.toggleUnblock);
router.delete('/users/:id',checkAdmin, authController.deleteUser);

//templates
router.get('/templates',authMiddleware, getTemplates);
router.get('/templates/:id',authMiddleware, getTemplateById);
router.post('/templates', upload.single('image'),authMiddleware, createTemplate);//++
router.patch('/templates/:id',checkTemplates, updateTemplate);//++
router.delete('/templates/:id',checkTemplates, deleteTemplate);//??

//questions//+
router.get('/templates/:id/questions', authMiddleware,questionController.getAllQuestions);
router.post('/templates/:id/questions',authMiddleware, questionController.addQuestions);
router.patch('/templates/:id/questions/:questionId',checkAdmin, questionController.editQuestions);
router.delete('/templates/:id/questions/:questionId',checkAdmin, questionController.deleteQuestions);

//comments//+
router.get('/templates/:id/comments',authMiddleware, commentsController.getCommentsByTemplates);
router.get('/users/:id/comments',authMiddleware, commentsController.getCommentsByUsers);
router.post('/templates/:id/comments',authMiddleware, commentsController.addComment);

//forms+++
router.get('/forms',authMiddleware, formsController.getAllForms);
router.get('/forms/:id',authMiddleware, formsController.getFormsById);
router.patch('/forms/:id',checkAdmin, formsController.updateForms);
router.post('/forms', checkAdmin,formsController.createForms);
router.delete('/forms/:id',checkAdmin, formsController.deleteForms);

//answers+
router.post('/answer',authMiddleware, answerController.addAnswer);
router.get('/answer',checkAdmin, answerController.getAnswerWithFilter);
router.get('/answers/:id',checkAdmin, answerController.getAnswerById);
router.delete('/answers/:id',checkAdmin, answerController.deleteAnswer);
router.patch('/answers/:id',checkAdmin, answerController.editAnswer);

//like//+
router.get('/templates/:id/like',authMiddleware, likeController.getLikes);
router.post('/templates/:id/like',authMiddleware, likeController.addLike);
router.delete('/templates/:id/like',authMiddleware, likeController.removeLike);
//Теги и темы //+
router.get('/tags',authMiddleware, tagsController.getTags);
router.post('/tags',checkAdmin, tagsController.createTag);
//Главная страница //+

router.get("/latest-templates",authMiddleware, homeController.getLatestTemplates);
router.get("/top-templates",authMiddleware, homeController.getTopTemplates);
router.get("/tags-cloud",authMiddleware, homeController.getTagsCloud);

//Поиск//+
router.get('/search',authMiddleware, searchController.searchTemplates);

//Языки и темы интерфейса //+
router.get("/settings/:id",checkAdmin, settingsController.getSettings)
router.patch("/settings/:id",checkAdmin, settingsController.editSettings)
//Администрировани //+
router.get('/admin/statistics',checkAdmin, statisticController.getStatistics);
//права доступа

module.exports = router;