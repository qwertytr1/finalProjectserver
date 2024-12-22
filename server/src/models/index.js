const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const TokenSchema = require("./token-model.js");

const Tag = sequelize.define("tags", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
}, {
  timestamps: false,
  tableName: 'tags',
});

const User = sequelize.define('users', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING },
  theme: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
},
}, {
    timestamps: false,
});

  const Template = sequelize.define("templates", {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    category: Sequelize.STRING,
    image_url: Sequelize.STRING,
    is_public: Sequelize.BOOLEAN,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
  }, {
    timestamps: false,
  });
const Question = sequelize.define("questions", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  type: Sequelize.STRING,
  order: Sequelize.INTEGER,
  show_in_results: Sequelize.BOOLEAN,
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id'
    }
  },
  correct_answer: Sequelize.STRING(255)
}, {
  timestamps: false,
});

const Form = sequelize.define("forms", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  submitted_at: Sequelize.DATE,
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id'
    }
  },
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
});


const Answer = sequelize.define("answers", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  answer: Sequelize.STRING,
  forms_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'forms',
      key: 'id'
    }
  },
 questions_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'questions ',
      key: 'id'
    }
  },
  is_correct: Sequelize.BOOLEAN,
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
});

const Comment = sequelize.define("comments", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  content: Sequelize.TEXT,
  created_at: Sequelize.DATE,
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id'
    }
  },
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
});

const TemplatesTag = sequelize.define("template_tag", {
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "templates",
      key: "id",
    },
  },
  tags_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "tags",
      key: "id",
    },
  },
}, {
  timestamps: false,
});


const Like = sequelize.define("likes", {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'templates',
      key: 'id'
    }
  },
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: false,
});
const TemplatesAccess = sequelize.define("template_access", {
  templates_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "templates",
      key: "id",
    },
  },
  users_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
}, {
  timestamps: false,
});

Template.hasMany(Like, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Template.hasMany(Question, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Template.hasMany(Comment, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Template.hasMany(Form, { foreignKey: 'templates_id', onDelete: 'CASCADE' });
Template.belongsToMany(Tag, {
  through: TemplatesTag,
  foreignKey: "templates_id",
  otherKey: "tags_id",
  onDelete: "CASCADE"
});
User.hasMany(TokenSchema, { foreignKey: 'user_id' });
TokenSchema.belongsTo(User, { foreignKey: 'user_id' });
Template.belongsTo(User, { foreignKey: 'users_id' });
Question.hasMany(Answer, { foreignKey: 'questions_id' });
User.hasMany(Template, { foreignKey: 'users_id' });
Template.belongsToMany(Tag, {
  through: TemplatesTag,
  foreignKey: "templates_id",
  otherKey: "tags_id",
});

Tag.belongsToMany(Template, {
  through: TemplatesTag,
  foreignKey: "tags_id",
  otherKey: "templates_id",
});
Question.belongsTo(Template, { foreignKey: "templates_id" });
Form.belongsTo(Template, { foreignKey: "templates_id" });
Form.belongsTo(User, { foreignKey: "users_id" });
Answer.belongsTo(Form, { foreignKey: "forms_id" });
Answer.belongsTo(Question, { foreignKey: "questions_id" });
Comment.belongsTo(Template, { foreignKey: "templates_id" });
Comment.belongsTo(User, { foreignKey: "users_id" });
Like.belongsTo(Template, { foreignKey: "templates_id" });
Like.belongsTo(User, { foreignKey: "users_id" });

// Экспорт моделей
module.exports = {
  sequelize,
  User,
  Template,
  Question,
  Form,
  Answer,
  Comment,
  Like,
  TemplatesTag,
  TemplatesAccess,
  Tag
};
