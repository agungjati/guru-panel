import React, { Component } from "react";
import Table from "../../components/Table";
import MUIDataTable from "mui-datatables";
import { Redirect } from "react-router-dom";
import ButtonAction from "../../components/ButtonAction";
import ContentHeader from "../../components/ContentHeader";
import QuestionController from "../../controllers/questions";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

class List extends Component {
  controller = new QuestionController();
  toastr = toastr;
  state = {
    title: "Questions",
    data: [],
    columns : [
      { name: "id", options: { display: false } },
      { name: "question", label: "Question", options: { sort: true } },
      { name: "answer", label: "Answer", options: { sort: true } },
      { name: "courses.name", label: "Courses", options: { sort: true } },
      { name: "class.className", label: "Classes", options: { sort: true } },
      { name: "Workflow.status", label: "Status", options: { sort: true, display: false } },
    ],
    isRedirect: false,
    idSelected: ""
  };

  componentDidMount() {
    this.controller
      .getList()
      .then(res => res.data)
      .then(questions => {
        this.setState({
          data: questions
        });
      })
      .catch(e => this.toastr.error((e.response?.data?.message) || e.message));
  }
  onRowClick	= (rowData) => {
    const status = rowData[rowData.length - 1]
    if(status === "pending" || status == null){
      this.setState({
        isRedirect: true,
        idSelected: rowData[0]
      })
    }
  }
  onRowsDelete = (rowData) => {
    const index = rowData.data[0].index;
    const data = this.state.data.filter((x, idx) => idx !== index);
    this.setState({data})
  }   
  render() {
    const {  columns, data, title, isRedirect, idSelected  } = this.state;
    return (
      isRedirect ? <Redirect to={ "/questions/"+ idSelected } /> :
      <div className="content-wrapper">
        <ContentHeader title="Questions" />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <ButtonAction
                    title="Add questions"
                    icon="fas fa-plus"
                    class="btn btn-primary float-right"
                    url="/questions/entry"
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
                    onRowsDelete: this.onRowsDelete,
                    // isRowSelectable: () => false,
                    selectableRows: 'single' }}
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
