import ControllerBase from "./ControllerBase";
import { QuestionsModel } from "../model/questionsModel";

class Questions extends ControllerBase {
  onInsert = (questions = QuestionsModel, image) => {
    const config = {
      headers: { "content-type": "multipart/form-data" }
    };

    let form_data = new FormData();
    form_data.append("data", JSON.stringify(questions));
    if (image)
      form_data.append("files.questionImage", image, image.name);

    return this.axios.post("/questions", form_data, config);
  };

  onUpdate = (questions = QuestionsModel) => {
    return this.axios.put("/questions/" + questions.id, questions);
  };

  getList = () => {
    return this.axios.get("/questions");
  };

  getCount = () => {
    return this.axios.get("/questions/count");
  };

  getById = id => {
    return this.axios.get("/questions/" + id);
  };

  onDelete = id => {
    return this.axios.delete("/questions/" + id);
  };
}

export default Questions;
