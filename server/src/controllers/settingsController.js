const { Template, User, Tag, Question, Answer } = require("../models/index");
const SettingService = require("../services/settings-service.js")
exports.getSettings = async (req, res, next) => {
    const id = req.params.id;
  try {
      // Await the async function to ensure it resolves before accessing its properties
      const users = await SettingService.getSettings(id);

      // Use the resolved status and json properties correctly
      res.status(users.status).json(users.json);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
exports.editSettings = async (req, res, next) => {
    const id = req.params.id;
    const { language, theme, role } = req.body;

    // Валидация данных
    if (theme && !["light", "dark"].includes(theme)) {
      return res.status(400).json({ message: "Invalid theme value" });
    }
    if (language && typeof language !== "string") {
      return res.status(400).json({ message: "Invalid language value" });
    }

  try {
      // Await the async function to ensure it resolves before accessing its properties
      const users = await SettingService.editSettings(id, language, theme, role);

      // Use the resolved status and json properties correctly
      res.status(users.status).json(users.json);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};