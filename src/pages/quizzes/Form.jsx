import React, { Component } from 'react'
import AsyncSelect from 'react-select/async'
import ContentHeader from '../../components/ContentHeader'
import CKEditor from 'ckeditor4-react'
import QuizController from '../../controllers/quizzes'
import ClassController from '../../controllers/classes'
import ChapterController from '../../controllers/chapters'
import CourseController from '../../controllers/courses'
import QuestionController from '../../controllers/questions'
import { QuizModel } from '../../model/QuizModel'
import 'toastr/build/toastr.min.css'
import toastr from 'toastr'

class Form extends Component {

  toastr = toastr;
  quizController = new QuizController();
  classController = new ClassController();
  chapterController = new ChapterController();
  courseController = new CourseController();
  questionController = new QuestionController();

  state = {
    model: { ...QuizModel },
    isEntry: true
  }
  configCKEditor = {
    extraPlugins: 'mathjax',
    mathJaxLib: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML',
    height: 320
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
        .catch(e => this.toastr.error(e.response.data.message))
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

      if (this.state.isEntry) {
        this.quizController.onInsert({ ...this.state.model, chapters, courses, classes })
        .then(() => this.toastr.success('Successfully saved'))
        .catch(e => this.toastr.error(e.response.data.message))
      } else {
        this.quizController.onUpdate({ ...this.state.model, chapters, courses, classes })
        .then(() => this.toastr.success('Successfully saved'))
        .catch(e => this.toastr.error(e.response.data.message))
      }
    }
  }

  onResetForm = () => {
    this.setState({ model: { ...QuizModel } })
  }

  loadChapter = (inputValue, callback) => {
    if (inputValue) {
      this.chapterController
        .getList({ _q: inputValue })
        .then(res => res.data)
        .then(res => {
          const chapters = res.map(x => ({ value: x.id, label: x.name }))
          callback(chapters)
        })
        .catch(e => this.toastr.error(e.response.data.message));

    } else {
      callback(null)
    }
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
    if (inputValue) {
      this.classController
        .getList({ _q: inputValue })
        .then(res => res.data)
        .then(res => {
          const classes = res.map(x => ({ value: x.id, label: x.className }))
          callback(classes)
        })
        .catch(e => this.toastr.error(e.response.data.message));

    } else {
      callback(null)
    }
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
    this.questionController
      .getList({ _q: inputValue })
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
    if (inputValue) {
      this.courseController
        .getList({ _q: inputValue })
        .then(res => res.data)
        .then(res => {
          const courses = res.map(x => ({ value: x.id, label: x.name }))
          callback(courses)
        })
        .catch(e => this.toastr.error(e.response.data.message));
        
    } else {
      callback(null)
    }
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
    const { model, isEntry } = this.state
    return (
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
                  <CKEditor
                    onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
                    config={this.configCKEditor}
                    data={model.description}
                    onChange={(ev) => this.onChangeModel("description", ev.editor.getData())} />
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
                        <label>Chapter</label>
                        <AsyncSelect
                          placeholder="Select a chapter"
                          closeMenuOnSelect={false}
                          isMulti
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
                        <label>Class</label>
                        <AsyncSelect
                          placeholder="Select a class"
                          closeMenuOnSelect={false}
                          isMulti
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
                        <label>Questions</label>
                        <AsyncSelect
                          isMulti
                          placeholder="Select questions"
                          closeMenuOnSelect={false}
                          cacheOptions
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
                        <label>Course</label>
                        <AsyncSelect
                          placeholder="Select a course"
                          closeMenuOnSelect={false}
                          isMulti
                          cacheOptions
                          value={model.courses}
                          loadOptions={this.loadCourse}
                          onChange={this.handleCourseClass} />

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
