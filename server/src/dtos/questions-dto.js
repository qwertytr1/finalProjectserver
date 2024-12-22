module.exports = class QuestionsDto{
    id;
    title;
    description;
    type;
    order;
    showInResults;
    correct_answer;
    constructor(model) {
        this.title = model.title;
        this.id = model.id;
        this.description = model.description;
        this.type = model.type;
        this.order = model.order;
        this.showInResults = model.showInResults;
        this.correct_answer = model.correct_answer;
    }

}