import React, { Component } from 'react'
import AsyncSelect from 'react-select/async'
import ContentHeader from '../../components/ContentHeader'

import QuizController from '../../controllers/quizzes'
import ClassController from '../../controllers/classes'
import ChapterController from '../../controllers/chapters'
import CourseController from '../../controllers/courses'
import QuestionController from '../../controllers/questions'
import { QuizModel } from '../../model/QuizModel'
import 'toastr/build/toastr.min.css'
import toastr from 'toastr'
import { Redirect } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
class Form extends Component {

  toastr = toastr;
  quizController = new QuizController();
  classController = new ClassController();
  chapterController = new ChapterController();
  courseController = new CourseController();
  questionController = new QuestionController();

  state = {
    model: { ...QuizModel },
    isEntry: true,
    isRedirect: false
  }

  componentDidMount() {
    const paramId = this.props.match.params.id;
    if (paramId !== "entry" && paramId !== undefined) {
      this.setState({ isEntry: false })
      this.quizController.getById(paramId)
        .then(res => res.data)
        .then(res => {
          res.chapters = res.chapters.map(x => ({ label: x.name, value: x.id }))
          res.questions = res.questions.map(x => ({ label: x.question, value: x.id }))
          res.classes = res.classes.map(x => ({ label: x.className, value: x.id }))
          res.courses = res.courses.map(x => ({ label: x.name, value: x.id }))
          this.setState({ model: { ...res } })
        })
        .catch(e => this.toastr.error(e.response?.data?.message))
    }

  }

  componentWillUnmount(){
    const mathTypeEl = document.querySelector("div[id='wrs_modal_dialogContainer[0]']");
    if(mathTypeEl){
      mathTypeEl.remove(); 
    }
  }
  onChangeModel = (type, value) => {
    this.setState({ model: { ...this.state.model, [type]: value } })
  }

  isNotValidInputForm = () => {
    const { model } = this.state;
    const fieldRequired = [model.quizName, model.description, model.capacity, model.durationMinute, model.totalQuestions];
    return fieldRequired.includes("") || fieldRequired.includes(null) || fieldRequired.includes(undefined);
  }

  onSaveForm = () => {
    if (this.isNotValidInputForm()) {
      this.toastr.warning('The field required must be filled.')
    }else{
      const chapters = this.state.model.chapters.map(x => x.value);
      const courses = this.state.model.courses.map(x => x.value);
      const classes = this.state.model.classes.map(x => x.value);
      const questions = this.state.model.questions.map(x => x.value);

      if (this.state.isEntry) {
        this.quizController.onInsert({ ...this.state.model, chapters, courses, classes, questions })
        .then(() => {
          this.toastr.success('Successfully saved')
          this.setState({ isRedirect: true })
        })
        .catch(e => this.toastr.error(e.response.data.message))
      } else {
        this.quizController.onUpdate({ ...this.state.model, chapters, courses, classes, questions })
        .then(() => {
          this.toastr.success('Successfully saved')
          this.setState({ isRedirect: true })
        })
        .catch(e => this.toastr.error(e.response.data.message))
      }
    }
  }

  onResetForm = () => {
    this.setState({ model: { ...QuizModel } })
  }

  loadChapter = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.chapterController
    .getList(param)
    .then(res => res.data)
    .then(res => {
      const chapters = res.map(x => ({ value: x.id, label: x.name }))
      callback(chapters)
    })
    .catch(e => this.toastr.error(e.response.data.message));
    
  }

  handleChangeChapter = (chapters) => {
    if (chapters === null) { chapters = [] }
    this.setState({
      model: {
        ...this.state.model,
        chapters: [...chapters]
      }
    })
  }


  loadClass = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.classController
    .getList(param)
    .then(res => res.data)
    .then(res => {
      const classes = res.map(x => ({ value: x.id, label: x.className }))
      callback(classes)
    })
    .catch(e => this.toastr.error(e.response.data.message));

  }

  handleChangeClass = (cls) => {
    if (cls === null) { cls = [] }
    this.setState({
      model: {
        ...this.state.model,
        classes: [...cls]
      }
    })
  }

  loadQuestion = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.questionController
      .getList(param)
      .then(res => res.data)
      .then(res => {
        const questions = res.map(x => ({ value: x.id, label: x.question }))
        callback([...questions])
      })
      .catch(e => this.toastr.error(e.response.data.message));

  }

  handleChangeQuestion = (question) => {
    if (question === null) { question = [] }
    this.setState({
      model: {
        ...this.state.model,
        questions: [...question]
      }
    })
  }


  loadCourse = (inputValue, callback) => {
    const param = inputValue.length > 0 ? { _q: inputValue } : {};
    this.courseController
    .getList(param)
    .then(res => res.data)
    .then(res => {
      const courses = res.map(x => ({ value: x.id, label: x.name }))
      callback(courses)
    })
    .catch(e => this.toastr.error(e.response.data.message));
  }

  handleChangeCourse = (cls) => {
    if (cls === null) { cls = [] }
    this.setState({
      model: {
        ...this.state.model,
        courses: [...cls]
      }
    })
  }



  render() {
    const { model, isEntry, isRedirect } = this.state
    return (
      isRedirect ? <Redirect to="/quiz" /> :
      <div className="content-wrapper">
        <div className='col-md-12'>

          <div className='row'>
            <div className='col-md-9'>
              {isEntry ? <ContentHeader title="Create An Entry" /> : <ContentHeader title="Edit quiz" />}
            </div>
            <div className='col-md-3 p-2 d-flex align-items-center justify-content-between'>
              <button onClick={this.onResetForm} className='btn btn-block' >Reset</button>
              <button onClick={this.onSaveForm} className='btn btn-block btn-success' >Save</button>
            </div>
          </div>
        </div>
        <div className="content">
          <div className='row'>
            <div className='col-md-8'>
              <div className="card">
                <div className="card-body pad">
                  <div className="form-group">
                    <label htmlFor="inputQuizName">Quiz Name</label>
                    <input
                      type="text"
                      id="inputQuizName"
                      className="form-control"
                      value={model.quizName}
                      onChange={(ev) => this.onChangeModel("quizName", ev.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="inputQuizName">Description</label>
                    <Editor
                      apiKey={ process.env.REACT_APP_TINYMCE_API}
                      value={model?.description || ""}
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
                      this.onChangeModel("description",	content)	
                    }
                    }/>
                  </div>
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="inputCapacity">Capacity</label>
                        <input
                          type="number"
                          id="inputCapacity"
                          className="form-control"
                          value={model.capacity}
                          onChange={(ev) => this.onChangeModel("capacity", ev.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="inputDurationMinute">Duration Minute</label>
                        <input
                          type="number"
                          id="inputDurationMinute"
                          className="form-control"
                          value={model.durationMinute}
                          onChange={(ev) => this.onChangeModel("durationMinute", ev.target.value)} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="inputTotalQuestions">Total Questions</label>
                        <input
                          type="number"
                          id="inputTotalQuestions"
                          className="form-control"
                          value={model.totalQuestions}
                          onChange={(ev) => this.onChangeModel("totalQuestions", ev.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4'>
              <div className="card">
                <div className="card-body pad">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Chapter ({model?.chapters?.length || 0})</label>
                        <AsyncSelect
                           placeholder="Add an item ..."
                          closeMenuOnSelect={false}
                          isMulti
                          defaultOptions
                          cacheOptions
                          value={model.chapters}
                          loadOptions={this.loadChapter}
                          onChange={this.handleChangeChapter} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Class ({model?.classes?.length || 0})</label>
                        <AsyncSelect
                           placeholder="Add an item ..."
                          closeMenuOnSelect={false}
                          isMulti
                          defaultOptions
                          cacheOptions
                          value={model.classes}
                          loadOptions={this.loadClass}
                          onChange={this.handleChangeClass} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Questions ({model?.questions?.length || 0})</label>
                        <AsyncSelect
                          isMulti
                          placeholder="Add an item ..."
                          closeMenuOnSelect={false}
                          cacheOptions
                          defaultOptions
                          value={model.questions}
                          loadOptions={this.loadQuestion}
                          onChange={this.handleChangeQuestion}
                        />

                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Course ({model?.courses?.length || 0})</label>
                        <AsyncSelect
                          placeholder="Add an item ..."
                          closeMenuOnSelect={false}
                          isMulti
                          cacheOptions
                          defaultOptions
                          value={model.courses}
                          loadOptions={this.loadCourse}
                          onChange={this.handleChangeCourse} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form
