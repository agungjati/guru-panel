import React, { Component } from "react";
import AsyncSelect from "react-select/async";
import MagicDropzone from "react-magic-dropzone";
import ContentHeader from "../../components/ContentHeader";
import FormGroup from "../../components/FormGroup";
import QuestionsController from "../../controllers/questions";
import QuestionSourcesController from "../../controllers/questionsources";
import ChaptersController from "../../controllers/chapters";
import ClassesController from "../../controllers/classes";
import TeachersController from "../../controllers/teachers";
import QuizzesController from "../../controllers/quizzes";
import { Editor } from '@tinymce/tinymce-react';
import "./styles.css";
import { QuestionsModel } from "../../model/questionsModel";
import {
  questionOptions,
  answerOptions,
  difficultiesOptions,
  explanationOptions
} from "./constant";
import "toastr/build/toastr.min.css";
import toastr from "toastr";
import { Redirect } from "react-router-dom";

const maxSizeVideo = 100 * 1000000;
class Form extends Component {
  questionsController = new QuestionsController();
  questionSourcesController = new QuestionSourcesController();
  chaptersController = new ChaptersController();
  classesController = new ClassesController();
  teachersController = new TeachersController();
  quizzesController = new QuizzesController();
  toastr = toastr;
  constructor(props) {
    super(props);
    this.state = {
      model: { ...QuestionsModel },
      classes: [],
      quizzes: [],
      isEntry: true,
      isRedirect: false,
      acceptedImage: "image/jpeg, image/png, .jpg, .jpeg, .png",
      acceptedVideo: "video/mp4",
      acceptedPdf: "application/pdf",
      questionImage: {},
      imageExplanation: {},
      pdfExplanation: {},
      videoExplanation: {},
      questionVideo: {},
      explanation: {
        questionImage: null,
        questionVideo: null,
        pdfExplanation: null,
        videoExplanation: null,
        imageExplanation: null
      }
    };
  }
  componentDidMount() {
    const paramId = this.props.match.params.id;
    if (paramId) {
      this.setState({ isEntry: false });
      this.questionsController
        .getById(paramId)
        .then(res => res.data)
        .then(res => {
          res.quizzes = res.quizzes.map(x => ({
            label: x.quizName,
            value: x.id
          }));
          this.setState({ model: { ...res } });
        })
        .catch(e => this.toastr.error(e.response?.data?.message));
    }
  }

  componentWillUnmount(){
    const mathTypeEls = document.querySelectorAll(`div[id='wrs_modal_dialogContainer[0]'], 
                                                   div[id='wrs_modal_dialogContainer[1]']`);
    mathTypeEls.forEach(mathTypeEl => mathTypeEl.remove());
  }
  onChangeModel = (type, value) => {
    let val = value;
    this.setState({ model: { ...this.state.model, [type]: val } });
  };

  loadQuestionSources = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.questionSourcesController
      .getList(param)
      .then(res => res.data)
      .then(res => {
        const questionsource = res.map(x => ({
          value: x.id,
          label: `${x.year}  ${x.sourceInfo}`
        }));
        this.setState({ questionsource: questionsource });
        callback([...questionsource]);
      })
      .catch(e => this.toastr.error(e.response?.data?.message));
  };

  onChangeQuestionSource = questionsource => {
    this.setState({
      model: {
        ...this.state.model,
        questionsource: questionsource
      }
    });
  };

  loadChapters = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.chaptersController
      .getList(param)
      .then(res => res.data)
      .then(res => {
        const chapters = res.map(x => ({ value: x.id, label: x.name }));
        this.setState({ chapters: chapters });
        callback([...chapters]);
      })
      .catch(e => this.toastr.error(e.response?.data?.message));
  };

  onChangeChapter = chapter => {
    this.setState({
      model: {
        ...this.state.model,
        chapter: chapter
      }
    });
  };

  loadClasses = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.classesController
      .getList(param)
      .then(res => res.data)
      .then(res => {
        const classes = res.map(x => ({ value: x.id, label: x.className }));
        this.setState({ classes: classes });
        callback([...classes]);
      })
      .catch(e => this.toastr.error(e.response?.data?.message));
  };

  onChangeKelas = kelas => {
    this.setState({
      model: {
        ...this.state.model,
        class: kelas
      }
    });
  };

  loadTeachers = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.teachersController
      .getList(param)
      .then(res => res.data)
      .then(res => {
        const teachers = res.map(x => ({ value: x.id, label: x.NUPTK }));
        this.setState({ teachers: teachers });
        callback([...teachers]);
      })
      .catch(e => this.toastr.error(e.response?.data?.message));
  };

  onChangeTeacher = teacher => {
    this.setState({
      model: {
        ...this.state.model,
        teacher: teacher
      }
    });
  };

  loadQuizzes = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.quizzesController
      .getList(param)
      .then(res => res.data)
      .then(res => {
        const quizzes = res.map(x => ({ value: x.id, label: x.quizName }));
        this.setState({ quizzes: quizzes });
        callback([...quizzes]);
      })
      .catch(e => this.toastr.error(e.response?.data?.message));
  };

  onChangeQuiz = quiz => {
    this.setState({
      model: {
        ...this.state.model,
        quizzes: quiz
      }
    });
  };
  onDropRejected = e => {
    if (e && e[0]?.size > maxSizeVideo)
      this.toastr.error("Video size is too large, max 100 Mb");
  };
  onDrop = (
    accepted,
    rejected,
    links,
    onDropRejected,
    rejectedFiles
  ) => key => {
    accepted = accepted.map(v => v.preview);
    onDropRejected = this.onDropRejected(onDropRejected);
    var newState = {
      ...this.state[key],
      ...accepted,
      ...links
    };
    this.setState({
      [key]: newState
    });
  };
  handleUploadFileChange = (e, key) => {
    this.setState({
      explanation: { ...this.state.explanation, [key]: e.target.files[0] }
    });
  };

  onSaveForm = () => {
    const quizzes = this.state.model?.quizzes?.map(x => x.value) || [];
    const { questionsource, chapter, class: kelas, teacher } = this.state.model;
    const data = {
      ...this.state.model,
      quizzes,
      questionsource: questionsource?.value || null,
      chapter: chapter?.value || null,
      class: kelas?.value || null,
      teacher: teacher?.value || null,
      Workflow: {
        status: "pending"
      }
    };
    if (this.state.isEntry) {
      this.questionsController
        .onInsert(data, this.state.explanation)
        .then(() => {
          this.toastr.success("Successfully saved");
          this.setState({ isRedirect: true });
        })
        .catch(e => this.toastr.error(e.response?.data?.message));
    } else {
      this.questionsController
        .onUpdate(data)
        .then(() => {
          this.toastr.success("Successfully saved");
          this.setState({ isRedirect: true });
        })
        .catch(e => this.toastr.error(e.response?.data?.message));
    }
  };
  onResetForm = () => {
    this.setState({ model: { ...QuestionsModel } });
  };
  render() {
    const {
      model,
      isEntry,
      isRedirect,
      acceptedImage,
      acceptedVideo,
      acceptedPdf,
      questionImage,
      imageExplanation,
      pdfExplanation,
      videoExplanation,
      questionVideo
    } = this.state;
    return isRedirect ? (
      <Redirect to="/questions" />
    ) : (
      <div className="content-wrapper">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-8">
              <ContentHeader
                title={`${isEntry ? "Create " : "Edit"} Question`}
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
                          <FormGroup
                            label="Question"
                            name="question"
                            value={model.question}
                            componentType="input"
                            onChange={ev =>
                              this.onChangeModel("question", ev.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <FormGroup
                            label="Question Type"
                            name="questionType"
                            value={model.questionType}
                            options={questionOptions}
                            componentType="select"
                            onChange={ev =>
                              this.onChangeModel(
                                "questionType",
                                ev.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Question Detail</label>
                              <Editor
                                apiKey={ process.env.REACT_APP_TINYMCE_API}
                                value={model?.questionDetail || ""}
                                init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                  'advlist autolink lists link image charmap print preview anchor',
                                  'searchreplace visualblocks code fullscreen',
                                  'insertdatetime media table paste code help wordcount',
                                ],
                                external_plugins: {
                                  'tiny_mce_wiris': '/plugins/plugin.min.js'
                                },
                                toolbar:
                                'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | bullist numlist outdent indent | removeformat | help'
                              }}
                              onEditorChange={(content) => {
                                this.onChangeModel("questionDetail",	content)	
                              }
                              }/>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Question Image</label>
                            <MagicDropzone
                              className="Dropzone"
                              accept={acceptedImage}
                              onChange={e =>
                                this.handleUploadFileChange(e, "questionImage")
                              }
                              onDrop={(accepted, rejected, links) =>
                                this.onDrop(
                                  accepted,
                                  rejected,
                                  links
                                )("questionImage")
                              }
                            >
                              <div className="Dropzone-content">
                                {Object.keys(questionImage).length > 0 ? (
                                  <img
                                    key={questionImage[0]}
                                    alt=""
                                    className="Dropzone-img"
                                    src={questionImage[0]}
                                  />
                                ) : (
                                  "Drag & drop your file into this area or browse for a file to upload"
                                )}
                              </div>
                            </MagicDropzone>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Question Video</label>
                            <MagicDropzone
                              className="Dropzone"
                              maxSize={maxSizeVideo}
                              accept={acceptedVideo}
                              onChange={e =>
                                this.handleUploadFileChange(e, "questionVideo")
                              }
                              onDrop={(accepted, rejected, links) =>
                                this.onDrop(
                                  accepted,
                                  rejected,
                                  links
                                )("questionVideo")
                              }
                              onDropRejected={this.onDropRejected}
                            >
                              <div className="Dropzone-content">
                                {Object.keys(questionVideo).length > 0 ? (
                                  <img
                                    key={questionVideo[0]}
                                    alt=""
                                    className="Dropzone-img"
                                    src="/dist/icon/mp4Icon.svg"
                                  />
                                ) : (
                                  "Drag & drop your file into this area or browse for a file to upload"
                                )}
                              </div>
                            </MagicDropzone>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <FormGroup
                            label="Option A"
                            name="optionA"
                            value={model.optionA}
                            componentType="input"
                            onChange={ev =>
                              this.onChangeModel("optionA", ev.target.value)
                            }
                          />
                        </div>

                        <div className="col-md-6">
                          <FormGroup
                            label="Option B"
                            name="optionB"
                            value={model.optionB}
                            componentType="input"
                            onChange={ev =>
                              this.onChangeModel("optionB", ev.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <FormGroup
                            label="Option C"
                            name="optionC"
                            value={model.optionC}
                            componentType="input"
                            onChange={ev =>
                              this.onChangeModel("optionC", ev.target.value)
                            }
                          />
                        </div>

                        <div className="col-md-6">
                          <FormGroup
                            label="Option D"
                            name="optionD"
                            value={model.optionD}
                            componentType="input"
                            onChange={ev =>
                              this.onChangeModel("optionD", ev.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <FormGroup
                            label="Option E"
                            name="optionE"
                            value={model.optionE}
                            componentType="input"
                            onChange={ev =>
                              this.onChangeModel("optionE", ev.target.value)
                            }
                          />
                        </div>

                        <div className="col-md-6">
                          <FormGroup
                            label="Answer"
                            name="answer"
                            value={model.answer}
                            options={answerOptions}
                            componentType="select"
                            onChange={ev =>
                              this.onChangeModel("answer", ev.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <FormGroup
                              label="Explanation Type"
                              name="explanationType"
                              value={model.explanationType}
                              options={explanationOptions}
                              componentType="select"
                              onChange={ev =>
                                this.onChangeModel(
                                  "explanationType",
                                  ev.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <FormGroup
                              label="Difficulties"
                              name="difficulties"
                              value={model.difficulties}
                              options={difficultiesOptions}
                              componentType="select"
                              onChange={ev =>
                                this.onChangeModel(
                                  "difficulties",
                                  ev.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group">
                              <label>Text Explanation</label>
                              <Editor
                                apiKey={ process.env.REACT_APP_TINYMCE_API}
                                value={model?.textExplanation || ""}
                                init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                  'advlist autolink lists link image charmap print preview anchor',
                                  'searchreplace visualblocks code fullscreen',
                                  'insertdatetime media table paste code help wordcount',
                                ],
                                external_plugins: {
                                  'tiny_mce_wiris': '/plugins/plugin.min.js'
                                },
                                toolbar:
                                'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry | bullist numlist outdent indent | removeformat | help'
                              }}
                              onEditorChange={(content) => {
                                this.onChangeModel("textExplanation",	content)	
                              }
                              }/>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Pdf Explanation</label>
                            <MagicDropzone
                              className="Dropzone"
                              accept={acceptedPdf}
                              onChange={e =>
                                this.handleUploadFileChange(e, "pdfExplanation")
                              }
                              onDrop={(accepted, rejected, links) =>
                                this.onDrop(
                                  accepted,
                                  rejected,
                                  links
                                )("pdfExplanation")
                              }
                            >
                              <div className="Dropzone-content">
                                {Object.keys(pdfExplanation).length > 0 ? (
                                  <img
                                    key={pdfExplanation[0]}
                                    alt=""
                                    className="Dropzone-img"
                                    src="/dist/icon/pdfIcon.svg"
                                  />
                                ) : (
                                  "Drag & drop your file into this area or browse for a file to upload"
                                )}
                              </div>
                            </MagicDropzone>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Video Explanation</label>
                            <MagicDropzone
                              className="Dropzone"
                              maxSize={maxSizeVideo}
                              accept={acceptedVideo}
                              onChange={e =>
                                this.handleUploadFileChange(
                                  e,
                                  "videoExplanation"
                                )
                              }
                              onDrop={(accepted, rejected, links) =>
                                this.onDrop(
                                  accepted,
                                  rejected,
                                  links
                                )("videoExplanation")
                              }
                              onDropRejected={this.onDropRejected}
                            >
                              <div className="Dropzone-content">
                                {Object.keys(videoExplanation).length > 0 ? (
                                  <img
                                    key={videoExplanation[0]}
                                    alt=""
                                    className="Dropzone-img"
                                    src="/dist/icon/mp4Icon.svg"
                                  />
                                ) : (
                                  "Drag & drop your file into this area or browse for a file to upload"
                                )}
                              </div>
                            </MagicDropzone>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Image Explanation</label>
                            <MagicDropzone
                              className="Dropzone"
                              accept={acceptedImage}
                              onChange={e =>
                                this.handleUploadFileChange(
                                  e,
                                  "imageExplanation"
                                )
                              }
                              onDrop={(accepted, rejected, links) =>
                                this.onDrop(
                                  accepted,
                                  rejected,
                                  links
                                )("imageExplanation")
                              }
                            >
                              <div className="Dropzone-content">
                                {Object.keys(imageExplanation).length > 0 ? (
                                  <img
                                    key={imageExplanation[0]}
                                    alt=""
                                    className="Dropzone-img"
                                    src={imageExplanation[0]}
                                  />
                                ) : (
                                  "Drag & drop your file into this area or browse for a file to upload"
                                )}
                              </div>
                            </MagicDropzone>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card">
                    <div className="card-body pad">
                      <div className="form-group">
                        <label>Question Source</label>
                        <AsyncSelect
                          value={model.questionsource}
                          placeholder="Add an item ..."
                          cacheOptions
                          loadOptions={this.loadQuestionSources}
                          defaultOptions
                          onChange={this.onChangeQuestionSource}
                        />
                      </div>
                      <div className="form-group">
                        <label>Chapter</label>
                        <AsyncSelect
                          value={model.chapter}
                          placeholder="Add an item ..."
                          cacheOptions
                          loadOptions={this.loadChapters}
                          defaultOptions
                          onChange={this.onChangeChapter}
                        />
                      </div>
                      <div className="form-group">
                        <label>Class</label>
                        <AsyncSelect
                          value={model.class}
                          placeholder="Add an item ..."
                          cacheOptions
                          loadOptions={this.loadClasses}
                          defaultOptions
                          onChange={this.onChangeKelas}
                        />
                      </div>
                      <div className="form-group">
                        <label>Teacher</label>
                        <AsyncSelect
                          value={model.teacher}
                          placeholder="Add an item ..."
                          cacheOptions
                          loadOptions={this.loadTeachers}
                          defaultOptions
                          onChange={this.onChangeTeacher}
                        />
                      </div>
                      {/* multiple choices */}
                      <div className="form-group">
                        <label>Quizzes({model?.quizzes?.length || 0})</label>
                        <AsyncSelect
                          value={model.quizzes}
                          placeholder="Add an item ..."
                          closeMenuOnSelect={false}
                          isMulti
                          cacheOptions
                          loadOptions={this.loadQuizzes}
                          defaultOptions
                          onChange={this.onChangeQuiz}
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
    );
  }
}
export default Form;
