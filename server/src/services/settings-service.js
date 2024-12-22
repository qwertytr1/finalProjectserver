const {Form, User, Answer, Question} = require('../models/index.js');
class SettingService {
    async getSettings(id) {
        const user = await User.findByPk(id, {
            attributes: ["language", "theme", "role"],
          });
          if (!user) {
            return { status: 404, json: { error: 'user not found' } };
          }
return { status: 201, json: user  };
    }
    async editSettings(id, language, theme, role) {
        const user = await User.findByPk(id);

        if (!user) {
            return { status: 404, json: { error: 'user not found' } };
        }

        await user.update({ language, theme, role });

        return {
            status: 200,
            json:({
                message: "Settings updated successfully",
                settings: { language: user.language, theme: user.theme },
            })
        };
    }
}
module.exports = new SettingService();