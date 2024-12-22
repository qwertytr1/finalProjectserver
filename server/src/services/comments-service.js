const { Comment, User, Template } = require('../models/index.js');
class CommentsService{
    async getCommentsByTemplates(templateId) {
        const template = await Template.findByPk(templateId);
        if (!template) {
            return { status: 404, json: { error: 'Template not found' } };
        }

        // Get comments for the template
        //maybe add serch for users id;
        const comments = await Comment.findAll({
            where: { templates_id: templateId },
            order: [['created_at', 'ASC']],
        });
        // If no comments found
        if (!comments || comments.length === 0) {
            return { status: 404, json: { error: 'No comments found for this template' } };
        }

        return { status: 200, json: comments };
    }
    async getCommentsByUsers(userId) {
        const users = await User.findByPk(userId);
        if (!users) {
            return { status: 404, json: { error: 'Template not found' } };
        }
        const comments = await Comment.findAll({
            where: { users_id: userId },
            order: [['created_at', 'ASC']],
        });
        if (!comments || comments.length === 0) {
            return { status: 404, json: { error: 'No comments found for this template' } };
        }

        return { status: 200, json: comments };
    }
    async addComments(content,templateId, userId) {

  const template = await Template.findByPk(templateId);
  if (!template) {
    return { status: 404, json: { error: 'Template not found' } };
  }

  const comment = await Comment.create({
      content,
      users_id: userId,
      templates_id: templateId,
  });
  if (!content || content.length === 0) {
    return { status: 404, json: { error: 'No contente' } };
}
  return { status: 200, json: comment };
    }
}
module.exports = new CommentsService();