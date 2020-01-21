import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import ContentHeader from "../../components/ContentHeader";
import QuestionsController from "../../controllers/questions";
import QuestionsourcesController from "../../controllers/questionsources";
import { QuestionsourceModel } from "../../model/QuestionsourceModel";

class Form extends Component {
  questionsController = new QuestionsController();
  questionsourcesController = new QuestionsourcesController();
  state = {
    model: { ...QuestionsourceModel },
    isEntry: true,
    questions: []
  };

  componentDidMount() {
    const paramId = this.props.match.params.id;
    if (paramId) {
      this.setState({ isEntry: false });
      this.questionsourcesController
        .getById(paramId)
        .then(res => res.data)
        .then(res => {
          res.questions = res.questions.map(x => ({
            value: x.id,
            label: x.question
          }));
          this.setState({ model: { ...res } });
        });
    }
  }

  onChangeModel = (type, value) => {
    let val = value;
    if (type === "year") {
      val = value.length > 4 ? value.slice(0, 4) : value;
    }
    this.setState({ model: { ...this.state.model, [type]: val } });
  };

  loadQuestions = (inputValue, callback) => {
    this.questionsController
      .getList({ _q: inputValue })
      .then(res => res.data)
      .then(res => {
        const questions = res.map(x => ({ value: x.id, label: x.question }));
        this.setState({ questions: questions });
        callback([...questions]);
      });
  };

  onChangeQuestion = question => {
    this.setState({
      model: {
        ...this.state.model,
        questions: question
      }
    });
  };

  onSaveForm = () => {
    const questions = this.state.model?.questions?.map(x => x.value) || [];
    const data = { ...this.state.model, questions };
    if (this.state.isEntry) {
      this.questionsourcesController
        .onInsert(data)
        .then(() => alert("success"));
    } else {
      this.questionsourcesController
        .onUpdate(data)
        .then(() => alert("success"));
    }
  };

  onResetForm = () => {
    this.setState({ model: { ...QuestionsourceModel } });
  };
  render() {
    const { model, isEntry } = this.state;

    return (
      <div className="content-wrapper">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-8">
              <ContentHeader
                title={`${isEntry ? "Create A" : "Edit"} Question Source`}
              />
            </div>
            <div className="col-md-4 p-2">
              <div className="row p-2 float-right">
                <div className="col-md-6 p-2 ">
                  <button
                    onClick={this.onResetForm}
                    className="btn btn-block btn-default"
                  >
                    Reset
                  </button>
                </div>

                <div className="col-md-6 p-2 ">
                  <button
                    onClick={this.onSaveForm}
                    className="btn btn-block btn-success"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-body pad">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Source Info</label>
                            <input
                              type="text"
                              id="sourceInfo"
                              className="form-control"
                              name="sourceInfo"
                              value={model.sourceInfo}
                              onChange={ev =>
                                this.onChangeModel(
                                  "sourceInfo",
                                  ev.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label>Year</label>
                            <input
                              type="number"
                              id="year"
                              className="form-control"
                              name="year"
                              value={model.year}
                              onChange={ev =>
                                this.onChangeModel("year", ev.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body pad">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor=""> Questions ({model?.questions?.length || 0})</label>
                            <AsyncSelect
                              value={model.questions}
                              placeholder="Add an item ..."
                              closeMenuOnSelect={false}
                              isMulti
                              cacheOptions
                              loadOptions={this.loadQuestions}
                              defaultOptions
                              onChange={this.onChangeQuestion}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;
