import React, { Component } from 'react'
import Table from '../../components/Table'
import ButtonAction from '../../components/ButtonAction'
import ContentHeader from '../../components/ContentHeader'
import QuizzController from '../../controllers/quizzes';
import toastr from "toastr";
import "toastr/build/toastr.min.css";
class List extends Component {

  controller = new QuizzController();
  toastr = toastr;
  state = {
    dataTable: {
      thead : [ "No", "Quiz Name", "Capacity", "Duration Minute"],
      tbody : [],
      route: "quiz"
    }
  }

  componentDidMount()
  {
    
    this.controller.getList().then(res => res.data)
                   .then(quizzes => {
                     const tbody = quizzes.map((quiz, idx) => ({
                       id: quiz.id, No: ++idx, "Quiz Name": quiz.quizName, "Capacity": quiz.capacity, "Duration Minute": quiz.durationMinute
                     }))

                     this.setState({ 
                       dataTable: { ...this.state.dataTable, tbody: tbody} 
                      })

                   })
                   .catch(e => this.toastr.error(e.response?.data?.message));
  }

  render() {
    const { dataTable } = this.state
    return (
      <div className="content-wrapper">
        <ContentHeader title='List Quiz' />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Quizzes</h3>
                  <ButtonAction title='Add An Entry' icon='fas fa-plus' class='btn btn-primary float-right' url='/quiz/entry' />
                </div>
                <Table data={dataTable} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
