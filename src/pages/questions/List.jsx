import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import { Redirect } from "react-router-dom";
import ButtonAction from "../../components/ButtonAction";
import ContentHeader from "../../components/ContentHeader";
import QuestionController from "../../controllers/questions";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

const ListOption = ({ question: {optionA, optionB, optionC, optionD, optionE } }) => {
  const [ isCollapse, setCollapse] = React.useState(false)
  const collapsingList = () => {
    setCollapse(true)
  }
  const unCollapseList = () => {
    setCollapse(false)
  }
  const style = {
      transition: "all 0.5s ease",
      listStyle: "upper-latin",
  }
  
  return(<div onMouseOver={collapsingList} onMouseLeave={unCollapseList}>
        <ul style={ isCollapse ? { ...style, display: "none"} : style} >
          <li>{optionA}</li> 
          <li>{optionB}</li> 
        </ul>
        <ul style={ isCollapse ?  style : { ...style, visibility: "hidden", position: "fixed", top: -999, transform: "translateY(-50px)" } } >
          <li>{optionA}</li> 
          <li>{optionB}</li> 
          <li>{optionD}</li> 
          <li>{optionE}</li>
          <li>{optionC}</li> 
        </ul>
      </div>);
}
class List extends Component {  

  controller = new QuestionController();
  toastr = toastr;  
  state = {
    title: "Questions",
    data: [],
    columns : [
      { name: "id", options: { display: false } },
      { name: "no", label: "No.", options: { sort: true } },
      { name: "question", label: "Question", options: { sort: true } },
      { name: "option", 
        label: "Question", 
        options: { 
          customBodyRender: (value) => (
            <ListOption question={value} />
          )
        } 
      },
      { name: "questionType", label: "Question Type", options: { sort: true } },
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
          data: questions?.map((question, i) => {
                  const {optionA, optionB, optionC, optionD, optionE } = question;
                  return({...question, 
                          option: {optionA, optionB, optionC, optionD, optionE },
                          no: `${i+1}.` 
                        })
                })
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
