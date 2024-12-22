const {Form, User, Answer, Question} = require('../models/index.js');
class AnswerService {
    async getAnswerById(id) {
      const answer = await Answer.findByPk(id);
          if (!answer) {
            return { status: 404, json: { error: 'answers not found' } };
          }
return { status: 201, json: answer  };
    }
    async getAnswerByFilter(whereClause) {
      const answers = await Answer.findAll({ where: whereClause });
          if (!answers) {
            return { status: 404, json: { error: 'answers not found' } };
          }
return { status: 201, json: {...answers}  };
    }
    async createAnswer(answer, forms_id, questions_id, users_id) {
      const question = await Question.findOne({
          where: { id: questions_id },
        });

        if (!question) {
          return { status: 404, json: { error: 'answers not found' } };
        }

        const is_correct = question.correct_answer === answer;
      const newAnswer = await Answer.create({
          answer,
          forms_id,
          questions_id,
          is_correct,
          users_id
})

return { status: 201, json: { ...newAnswer } };
  }
  async deleteAnswer(id) {
    const deleted = await Answer.destroy({ where: { id } });
        if (!deleted) {
          return { status: 404, json: { error: 'answers not found' } };
        }
return { status: 201, json: "Cool"  };
  }
  async patch(id, answer, questions_id) {
    const question = await Question.findOne({
      where: { id: questions_id },
    });

    if (!question) {
      return { status: 404, json: { error: 'answers not found' } };
    }

    const is_correct = question.correct_answer === answer;
    const [updated] = await Answer.update(
      { answer, is_correct },
      { where: { id } }
    );

        if (!updated) {
          return { status: 404, json: { error: 'answers not found' } };
        }
return { status: 201, json: {...updated}  };
  }
}
module.exports = new AnswerService();