module.exports = class UserDto{
    id;
    email;
    username;
    language;
    theme;
    role;
    isBlocked;
    constructor(model) {
        this.email = model.email;
        this.id = model.id;
        this.username = model.username;
        this.language = model.language;
        this.theme = model.theme;
        this.role = model.role;
        this.isBlocked = model.isBlocked;
    }

}