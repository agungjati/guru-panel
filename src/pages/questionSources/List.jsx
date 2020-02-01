import React, { Component } from "react";
import moment from 'moment';
import Table from "../../components/Table";
import ButtonAction from "../../components/ButtonAction";
import ContentHeader from "../../components/ContentHeader";
import QuestionsourceController from "../../controllers/questionsources";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

class List extends Component {
  controller = new QuestionsourceController();
  toastr = toastr;

  state = {
    dataTable: {
      thead: ["No", "id", "Source Info", "Year", "Created At"],
      tbody: [],
      route: "question-sources"
    }
  };

  componentDidMount() {
    this.controller
      .getList()
      .then(res => res.data)
      .then(questionsources => {
        const tbody = questionsources.map((questionsource, idx) => ({
          No: ++idx,
          id: questionsource.id,
          "Source Info": questionsource.sourceInfo,
          Year: questionsource.year,
          "Created At": moment(new Date(questionsource.createdAt)).format(
            "D MMMM Y"
          )
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
        <ContentHeader title="List Question Sources" />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">List Question Sources</h3>
                  <ButtonAction
                    title="Add question sources"
                    icon="fas fa-plus"
                    class="btn btn-primary float-right"
                    url="/question-sources/entry"
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
