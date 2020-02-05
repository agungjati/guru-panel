import React, { Component } from "react";
import Table from "../../components/Table";
import moment from 'moment';
import ButtonAction from "../../components/ButtonAction";
import ContentHeader from "../../components/ContentHeader";
import QuestionController from "../../controllers/questions";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

class List extends Component {
  controller = new QuestionController();
  toastr = toastr;
  state = {
    dataTable: {
      thead: ["No", "Question", "Option", "Answer", "Courses", "Classes"],
      tbody: [],
      route: "questions"
    }
  };

  componentDidMount() {
    this.controller
      .getList()
      .then(res => res.data)
      .then(questions => {
        const tbody = questions.map((question, idx) => ({
          No: ++idx,
          id: question.id,
          "Question": question.question,
          Answer: question.answer,
          Courses: question.courses?.name, 
          Classes: question.class?.className
        }));
        this.setState({
          dataTable: { ...this.state.dataTable, tbody: tbody }
        });
      })
      .catch(e => this.toastr.error(e.response?.data?.message));
  }
  render() {
    const { dataTable } = this.state;
    return (
      <div className="content-wrapper">
        <ContentHeader title="Questions" />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">List Questions</h3>
                  <ButtonAction
                    title="Add questions"
                    icon="fas fa-plus"
                    class="btn btn-primary float-right"
                    url="/questions/entry"
                  />
                </div>
                <Table data={dataTable} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
