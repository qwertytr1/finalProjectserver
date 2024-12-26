const { Template, User, Tag, Question, Answer } = require("../models/index");
const AnswerService = require("../services/answer-service.js");
const jwt = require('jsonwebtoken');

const tokenService = require("../services/token-service.js");

exports.addAnswer = async (req, res, next) => {
  const { answer, forms_id, questions_id, } = req.body;
  const accessToken = req.headers['authorization']?.split(' ')[1];
  if (!accessToken) {
      throw ApiError.UnauthorizedError();
  }
  const userData = tokenService.validateAccessToken(accessToken);
  const users_id = userData.id;
    // Проверка на наличие обязательных данных
    if (!answer || !forms_id || !questions_id || !users_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

  try {
      // Await the async function to ensure it resolves before accessing its properties
      const answerCreater = await AnswerService.createAnswer(answer, forms_id, questions_id, users_id);

      // Use the resolved status and json properties correctly
      res.status(answerCreater.status).json(answerCreater.json);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getAnswerById = async (req, res, next) => {
  const  id = req.params.id;
try {
    // Await the async function to ensure it resolves before accessing its properties
    const answerGet = await AnswerService.getAnswerById(id);

    // Use the resolved status and json properties correctly
    res.status(answerGet.status).json(answerGet.json);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
};
exports.getAnswerWithFilter = async (req, res, next) => {
  const { forms_id, questions_id } = req.query;
  const whereClause = {};
  if (forms_id) whereClause.forms_id = forms_id;
  if (questions_id) whereClause.questions_id = questions_id;

try {
    const answerGetFilter = await AnswerService.getAnswerByFilter(whereClause);
    res.status(answerGetFilter.status).json(answerGetFilter.json);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
};
exports.editAnswer = async (req, res, next) => {
  const id  = req.params.id;
  const { answer, questions_id } = req.body;
try {
    const answerf = await AnswerService.patch(id,answer, questions_id);
    res.status(answerf.status).json(answerf.json);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
};
exports.deleteAnswer = async (req, res, next) => {
  const  id  = req.params.id;
try {

    const answerf = await AnswerService.deleteAnswer(id);
    res.status(answerf.status).json(answerf.json);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
}
};