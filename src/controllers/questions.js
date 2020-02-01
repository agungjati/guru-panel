import ControllerBase from "./ControllerBase";
import { QuestionsModel } from "../model/questionsModel";

class Questions extends ControllerBase {
  onInsert = (questions = QuestionsModel, explanation) => {
    const config = {
      headers: { "content-type": "multipart/form-data" }
    };

    let form_data = new FormData();
    form_data.append("data", JSON.stringify(questions));
    if (explanation.questionImage){
      form_data.append("files.questionImage", explanation.questionImage, explanation.questionImage.name);
    }
    if (explanation.questionVideo){
      form_data.append("files.questionVideo", explanation.questionVideo, explanation.questionVideo.name);
    }
    if (explanation.pdfExplanation){
      form_data.append("files.pdfExplanation", explanation.pdfExplanation, explanation.pdfExplanation.name);
    }
    if (explanation.videoExplanation){
      form_data.append("files.videoExplanation", explanation.videoExplanation, explanation.videoExplanation.name);
    }
    if (explanation.imageExplanation){
      form_data.append("files.imageExplanation", explanation.imageExplanation, explanation.imageExplanation.name);
    }

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
