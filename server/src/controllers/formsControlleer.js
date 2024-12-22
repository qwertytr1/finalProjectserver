const FormService = require('../services/forms-service.js');
const { Template, Form, User} = require("../models/index");
const jwt = require('jsonwebtoken');
const getUserIdFromToken = (req) => {
    const { refreshToken } = req.cookies; // Получаем токен из куки
    if (!refreshToken) return null;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log(decoded);
      return decoded.id;
    } catch (err) {
      return null; // Невалидный токен
    }
  };
exports.getAllForms = async (req, res, next) => {
    try {
        const forms = await FormService.getAllForms();
        res.status(forms.status).json(forms.json);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getFormsById = async (req, res, next) => {
    const { id: id } = req.params;
    console.log(id)
    try {
        const forms = await FormService.getFormsById(id);
        res.status(forms.status).json(forms.json);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
        exports.updateForms = async (req, res, next) => {
            const { id: id } = req.params;
            const formData = req.body;
            try {
                const forms = await FormService.updateForms(id, formData);
                res.status(forms.status).json(forms.json);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
        exports.createForms = async (req, res, next) => {
            const userId = getUserIdFromToken(req); // Получаем userId из токена

            if (!userId) {
                return res.status(401).json({ error: 'User is not authorized' }); // Проверка на авторизацию
            }

            const { templates_id: template_id } = req.body;

            try {
                // Проверка существования шаблона
                const template = await Template.findByPk(template_id);
                if (!template) {
                    return res.status(404).json({ error: 'Template not found' }); // Шаблон не найден
                }

                // Проверка существования пользователя
                const user = await User.findByPk(userId);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' }); // Пользователь не найден
                }

                // Создание формы
                const form = await Form.create({
                    templates_id: template_id,
                    users_id: userId,
                    submitted_at: new Date()
                });

                res.status(201).json({ message: 'Form created successfully', form });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        };

        exports.deleteForms = async (req, res, next) => {
            const { id: id } = req.params;
            try {
                const forms = await FormService.deleteForms(id);
                res.status(forms.status).send();
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
