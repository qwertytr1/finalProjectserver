const {Form, User, Template} = require('../models/index.js');
class FormService {
    async getAllForms() {
        const allForms = await Form.findAll({ include: User });
        if (!allForms) {
            return { status: 404, json: { error: 'allForms not found' } };
        }
        return { status: 200, json: allForms };
    }
    async getFormsById(id) {
        const allForms = await Form.findOne({ where:{id:id},include: User });
        if (!allForms) {
            return { status: 404, json: { error: 'Forms not found' } };
        }
        return { status: 200, json: allForms };
    }
    async updateForms(id, formData) {
        const [updated] = await Form.update(formData, {
            where: { id: id },
        });

        if (!updated) {
            return { status: 404, json: { error: 'Form not found' } };
        }

        const updatedForm = await Form.findByPk(id);
        return { status: 200, json: updatedForm };
    }
    async createForms(templates_id, user_id) {
        const newForms = await Form.create({
            submitted_at: new Date(),
            templates_id: templates_id,
            users_id:user_id
          });
          return { status: 200, json: newForms };

    }
    async deleteForms(id) {

      const form = await Form.findByPk(id);

      if (!form) {
        return { status: 404, json: { error: 'Forms not found' } };
      }

      await form.destroy();

        return { status: 204, json: form };
    }
}
module.exports = new FormService();