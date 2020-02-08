import React, { Component } from "react";
import moment from 'moment';
import Table from "../../components/Table";
import ButtonAction from "../../components/ButtonAction";
import ContentHeader from "../../components/ContentHeader";
import QuestionsourceController from "../../controllers/questionsources";
import MUIDataTable from "mui-datatables";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

class List extends Component {
  controller = new QuestionsourceController();
  toastr = toastr;

  state = {
    title: "Question Sources",
    data: [],
    columns : [
      { name: "id", options: { display: false } },
      { name: "sourceInfo", label: "Source Info", options: { sort: true } },
      { name: "year", label: "Year", options: { sort: true } },
      { name: "createdAt", label: "Created At", 
        options: { 
          sort: true,
          customBodyRender: (value) => {
            const createdAt =  moment(new Date(value)).format("D MMMM Y");
            return createdAt
          }
        }
      },
    ],
  };

  componentDidMount() {
    this.controller
      .getList()
      .then(res => res.data)
      .then(questionsources => {
        this.setState({
          data: questionsources
        });
      })
      .catch(e => this.toastr.error(e.response?.data?.message));

  }

  render() {
    const { columns, data, title } = this.state;
    return (
      <div className="content-wrapper">
        <ContentHeader title="List Question Sources" />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <ButtonAction
                    title="Add question sources"
                    icon="fas fa-plus"
                    class="btn btn-primary float-right"
                    url="/question-sources/entry"
                  />
                </div>
                <MUIDataTable
                  title={title}
                  data={data}
                  columns={columns}
                  options={{ 
                    filter: false, 
                    download: false, 
                    print: false,
                    onRowClick: this.onRowClick,
                    selectableRows: 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default List;
