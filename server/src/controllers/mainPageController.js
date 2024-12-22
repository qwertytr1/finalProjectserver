const { Template, Like, Tag } = require('../models/index.js')
const { Sequelize, Op } = require("sequelize"); // Для работы с запросами и операторами

exports.getLatestTemplates = async (req, res) => {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1); // Последние 24 часа

      const latestTemplates = await Template.findAll({
        where: {
          created_at: {
            [Sequelize.Op.gte]: oneDayAgo, // created_at >= oneDayAgo
          },
        },
        order: [['created_at', 'DESC']], // Сортировка по дате
      });

      res.status(200).json(latestTemplates);
    } catch (error) {
      console.error('Ошибка при получении последних шаблонов:', error);
      res.status(500).json({ error: 'Не удалось получить последние шаблоны' });
    }
  };
  exports.getTopTemplates = async (req, res) => {
    try {
        const topTemplates = await Template.findAll({
            attributes: {
              include: [
                [
                    Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM likes AS l
                    WHERE l.templates_id = templates.id
                  )`),
                  "likesCount",
                ],
              ],
            },
            order: [[Sequelize.literal("likesCount"), "DESC"]],
            limit: 10,
      });

      res.status(200).json(topTemplates);
    } catch (error) {
      console.error("Ошибка при получении топовых шаблонов:", error);
      res.status(500).json({ error: "Не удалось получить топовые шаблоны" });
    }
  };
  exports.getTagsCloud = async (req, res) => {
    try {
      const tagsCloud = await Tag.findAll({
        attributes: [
          'name',
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM tempate_tags AS tt
              WHERE tt.tags_id = tags.id
            )`),
            'usageCount', // Подсчитываем использование каждого тега
          ],
        ],
        order: [[Sequelize.literal('usageCount'), 'DESC']], // Сортируем по популярности
      });

      res.status(200).json(tagsCloud);
    } catch (error) {
      console.error('Ошибка при получении облака тегов:', error);
      res.status(500).json({ error: 'Не удалось получить облако тегов' });
    }
  };
