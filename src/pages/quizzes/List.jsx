import React, { Component } from 'react'
import ButtonAction from '../../components/ButtonAction'
import ContentHeader from '../../components/ContentHeader'
import QuizzController from '../../controllers/quizzes';
import MUIDataTable from "mui-datatables";
import { Redirect } from "react-router-dom";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
class List extends Component {

  controller = new QuizzController();
  toastr = toastr;
  state = {
    title: "Quizzes",
    data: [],
    columns : [
      { name: "id", options: { display: false } },
      { name: "quizName", label: "Quiz Name", options: { sort: true } },
      { name: "capacity", label: "Capacity", options: { sort: true } },
      { name: "durationMinute", label: "Duration Minute", options: { sort: true } },
      { name: "totalQuestions", label: "Total Questions", options: { sort: true } },
    ],
    isRedirect: false,
    idSelected: ""
  }

  componentDidMount()
  {
    
    this.controller.getList().then(res => res.data)
                   .then(quizzes => {
                     this.setState({ 
                       data: quizzes 
                      })
                   })
                   .catch(e => this.toastr.error(e.response?.data?.message));
  }
  onRowClick	= (rowData) => {
    this.setState({
      isRedirect: true,
      idSelected: rowData[0]
    })
  }
  
  render() {
    const { columns, data, title, isRedirect, idSelected  } = this.state
    return (
      isRedirect ? <Redirect to={ "/quiz/"+ idSelected } /> :
      <div className="content-wrapper">
        <ContentHeader title='List Quiz' />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <ButtonAction title='Add An Entry' icon='fas fa-plus' class='btn btn-primary float-right' url='/quiz/entry' />
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
    )
  }
}

export default List
