import React, { Component } from 'react'
import AsyncSelect from 'react-select/async'
import ContentHeader from '../../components/ContentHeader'
import QuestionController from '../../controllers/questions'
import ChapterController from '../../controllers/chapters'
import CurriculumController from '../../controllers/curriculums'
import QuizController from '../../controllers/quizzes'
import { ChapterModel } from '../../model/ChapterModel'


class Form extends Component {
  quizController = new QuizController()
  questionController = new QuestionController();
  chapterController = new ChapterController();
  curriculumController = new CurriculumController();

  state = {
      model: {...ChapterModel},
      curriculumOpts: [],
      quizzesOpts: [],
      userOpts: [],
      isEntry: true
    }

  componentDidMount()
  {
     const paramId = this.props.match.params.id;
    if(paramId !== "entry" && paramId !== undefined)
    {
      this.setState({ isEntry: false })
      this.chapterController.getById(paramId)
          .then(res => res.data)
          .then(res => {
            this.setState({ model: {...res} })
            
          })
    }

    this.curriculumController.getList()
    .then(res => res.data)
    .then(res => {
      this.setState({ curriculumOpts: res })
    })

    this.quizController.getList()
    .then(res => res.data)
    .then(res => {
      this.setState({ quizzesOpts: res })
    })
    
  }

  onChangeModel = (type, value) => {
    this.setState({ model: {...this.state.model, [type]: value } })
  }

  onChangeStateSubChapter = (idx, value) => {
    const subChapter = [...this.state.model.SubChapter]
    subChapter[idx].name = value;
    this.setState({ model: {...this.state.model, SubChapter: subChapter } })
  }
  onSaveForm = () => {
    // const chapters = this.state.model.chapters.map(x => x.id);
    // const courses = this.state.model.courses.map(x => x.id);
    // const classes = this.state.model.classes.map(x => x.id);
    console.log(this.state.model)
    if(this.state.isEntry){
    this.chapterController.onInsert(this.state.model)
        .then(() => alert('success'))
    }else{
      // this.quizController.onUpdate({...this.state.model, chapters, courses, classes })
      //   .then(() => alert('success'))
    }
  }

  onResetForm = () => {
    this.setState({ model: {...ChapterModel} })
  }

  loadQuestion = (inputValue, callback) => {
    this.questionController
      .getList({ _q: inputValue })
      .then(res => res.data)
      .then(res => {
        const questions = res.map(x => ({ value: x.id, label: x.question }))
        callback([...questions])
      })

  }
 
  handleChangeQuestion = (question) => {
      this.setState({ model: { 
          ...this.state.model, 
          questions: [ ...this.state.model.questions, {...question} ] 
        } 
      })
  }

  addSubChapter = () => {
    this.setState({ model: { ...this.state.model, SubChapter: [...this.state.model.SubChapter, {id: null, name: "" } ] } 
    })
  }

  deleteSubChapter = (idx) => {
    this.state.model.SubChapter.splice(idx, 1);
    this.setState({model: { ...this.state.model, SubChapter: [...this.state.model.SubChapter] } })
  }

  render() {
    const {  model, curriculumOpts, quizzesOpts, userOpts, isEntry } = this.state
    return (
      <div className="content-wrapper">
        <div className='col-md-12'>

          <div className='row'>
            <div className='col-md-9'>
              {isEntry ? <ContentHeader title="Create An Entry" /> : <ContentHeader title="Edit quiz" />}
            </div>
            <div className='col-md-3 p-2 d-flex align-items-center justify-content-between'>
              <a href="#" onClick={this.onResetForm} className='btn btn-block' >Reset</a>
              <a href="#" onClick={this.onSaveForm} className='btn btn-block btn-success' >Save</a>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className='row'>
                <div className='col-md-8'>
                  <div className="card">
                    <div className="card-body pad">
                      <div className="form-group">
                        <label htmlFor="inputName">Name</label>
                        <input 
                          type="text" 
                          id="inputName" 
                          className="form-control"
                          value={model.quizName}
                          onChange={(ev) => this.onChangeModel("name", ev.target.value)}
                           />
                      </div>
                      {model.SubChapter.map( (ch, idx) => 
                      (<div className="form-group" key={idx}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                        <label >Sub Chapter {idx+1}</label>
                          <div>
                            <button className="btn btn-sm btn-primary" 
                                    type="button" 
                                    data-toggle="collapse" 
                                    data-target={"#subChapter"+ idx}
                                    aria-expanded="false" 
                                    >
                            <i className="fa fa-edit"></i>
                            </button>&nbsp;
                            <button className="btn btn-sm btn-danger" 
                                    type="button" 
                                    onClick={() => this.deleteSubChapter(idx)}
                                    >
                            <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                        <div className="collapse"  id={ "subChapter"+ idx }>
                        <textarea 
                          className="form-control" 
                          rows="3" 
                          onChange={(ev) => this.onChangeStateSubChapter(idx, ev.target.value)}
                          defaultValue={ch.name}></textarea>
                        </div>
                      </div>
                      ))}
                      <button type="button" onClick={this.addSubChapter} className="btn btn-sm btn-primary">Add new sub chapter +</button>
                    </div>
                  </div>
                </div>

                <div className='col-md-4'>
                  <div className="card">
                    <div className="card-body pad d-flex flex-column">
                    <label >Curriculum</label>
                      <select 
                        className="form-control" 
                        onChange={(ev) => this.onChangeModel("curriculum", ev.target.value)}>
                          {curriculumOpts.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body pad d-flex flex-column">
                     <AsyncSelect 
                      isMulti
                      placeholder="Select questions"
                      closeMenuOnSelect={false}
                      cacheOptions
                      loadOptions={this.loadQuestion}
                      onChange={this.handleChangeQuestion}
                      />
                     
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body pad d-flex flex-column">
                    <label >Quiz</label>
                      <select 
                        className="form-control"
                        onChange={(ev) => this.onChangeModel("quiz", ev.target.value)}>
                          {quizzesOpts.map(op => <option key={op.id} value={op.id}>{op.quizName}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-body pad d-flex flex-column">
                    <label >User</label>
                      <select 
                        className="form-control"
                        onChange={(ev) => this.onChangeModel("user", ev.target.value)}>>
                          {userOpts.map(op => <option key={op.id} value={op.id}>{op.name}</option>)}
                      </select>
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
