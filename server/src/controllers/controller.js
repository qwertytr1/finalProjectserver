const {sequelize, Template, User, Tag, Question, TemplatesAccess, Like, Comment, Form, TemplatesTag} = require("../models/index");
const cloudinary = require('../config/cloudinary');
const jwt = require('jsonwebtoken'); // Для работы с токенами
// шаблоны
exports.createTemplate = async (req, res) => {
  try {
    const { title, description, category, image_url, is_public, tags } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Файл изображения не был загружен" });
    }

    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
        throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateAccessToken(accessToken);
    const userId = userData.id;

    // Загружаем изображение в Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Создаём новый шаблон
    const newTemplate = await Template.create({
      title,
      description,
      category,
      image_url: result.secure_url, // Ссылка на изображение из Cloudinary
      is_public: is_public || false,
      users_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Проверяем наличие тегов
    const tagIds = tags || []; // Передаётся массив ID тегов
    const existingTags = await Tag.findAll({
      where: { id: tagIds },
    });

    if (existingTags.length !== tagIds.length) {
      return res.status(400).json({
        error: "Один или несколько указанных тегов не существуют.",
      });
    }

    // Создаём связи шаблона с тегами
    const templatesTagData = existingTags.map((tag) => ({
      templates_id: newTemplate.id,
      tags_id: tag.id,
    }));

    await TemplatesTag.bulkCreate(templatesTagData);

    // Создаём запись в таблице templates_access
    await TemplatesAccess.create({
      users_id: userId,
      templates_id: newTemplate.id,
    });

    // Возвращаем успешный ответ
    return res.status(201).json({
      message: "Шаблон успешно создан",
      template: newTemplate,
    });
  } catch (err) {
    console.error("Ошибка при создании шаблона:", err);
    return res.status(500).json({
      error: "Ошибка при создании шаблона",
      details: err.message,
    });
  }
};


exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.findAll({ include: User });
    if (templates.length === 0) {
      return res.status(200).json({ message: "No templates found." });
    }
    res.status(200).json(templates);
  } catch (err) {
    console.error("Error fetching templates:", err);
    res.status(500).json({ error: "Failed to fetch templates." });
  }
};
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const dataToUpdate = {
      ...req.body,
      updated_at: new Date(),
    };

    const [updated] = await Template.update(dataToUpdate, {
      where: { id },
    });
    if (!updated) {
      return res.status(404).json({ error: "Template not found." });
    }

    const updatedTemplate = await Template.findByPk(req.params.id);
    res.status(200).json(updatedTemplate);
  } catch (err) {
    res.status(500).json({ error: "Failed to update template." });
  }
};

exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.findOne({
      where: { id },
      include: User,
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    res.status(200).json(template);
  } catch (err) {
    console.error("Error fetching template:", err);
    res.status(500).json({ error: "Failed to fetch template." });
  }
};

exports.deleteTemplate = async (req, res) => {
  const transaction = await sequelize.transaction(); // Начинаем транзакцию
  try {
      const templateId = req.params.id;

      // Проверяем существование шаблона
      const template = await Template.findByPk(templateId, { transaction });
      if (!template) {
          return res.status(404).json({ error: 'Template not found.' });
      }

      // Проверяем и удаляем связанные записи только при их наличии
      const relatedTables = [
          { model: TemplatesTag, where: { templates_id: templateId } },
          { model: Like, where: { templates_id: templateId } },
          { model: Question, where: { templates_id: templateId } },
          { model: Comment, where: { templates_id: templateId } },
          { model: Form, where: { templates_id: templateId } },
      ];

      for (const { model, where } of relatedTables) {
          const count = await model.count({ where, transaction });
          if (count > 0) {
              await model.destroy({ where, transaction });
          }
      }

      // Удаляем сам шаблон
      await template.destroy({ transaction });

      // Подтверждаем транзакцию
      await transaction.commit();

      return res.status(204).send();
  } catch (err) {
      // Откатываем транзакцию в случае ошибки
      await transaction.rollback();
      console.error('Ошибка при удалении шаблона:', err);
      res.status(500).json({ error: 'Failed to delete template.' });
  }
};
