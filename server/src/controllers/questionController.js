const { Template, User, Tag, Question, Answer } = require("../models/index");
const QuestionService = require("../services/question-service.js")
exports.getAllQuestions = async (req, res, next) => {
  const templateId = req.params.id;
  try {
    // Await the async function to ensure it resolves before accessing its properties
    const question = await QuestionService.GetAllQuestion(templateId);

    // Use the resolved status and json properties correctly
    res.status(question.status).json(question.json);
} catch (error) {
    next(error);
}
}
exports.addQuestions = async (req, res, next) => {
  const templateId = req.params.id;
  const { title, description, order, type, showInResults, correct_answer} = req.body;
  const allowedTypes = ['single-line', 'multi-line', 'integer', 'checkbox'];
  if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid question type' });
  }

  try {
      // Await the async function to ensure it resolves before accessing its properties
      const question = await QuestionService.AddQuestion(templateId, type, title, description, order, showInResults, correct_answer);

      // Use the resolved status and json properties correctly
      res.status(question.status).json(question.json);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.editQuestions = async (req, res, next) => {
  const  templateId  = req.params.id;
  const questionId  = req.params.questionId;
  console.log(templateId,questionId);
  const { title, description, order, type, showInResults } = req.body;
  const allowedTypes = ['single-line', 'multi-line', 'integer', 'checkbox'];
  if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid question type' });
  }
  try {
    const question = await QuestionService.editQuestion(questionId, templateId, type, title, description, order, showInResults);
    res.status(question.status).json(question.json);
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
}
exports.deleteQuestions = async (req, res, next) => {
  const  templateId  = req.params.id;
  const questionId  = req.params.questionId;
  console.log(templateId,questionId);
  try {
   await QuestionService.deleteQuestion(questionId, templateId);
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}
}
