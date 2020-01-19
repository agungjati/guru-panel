import React, { Component } from 'react'
import Table from '../../components/Table'
import ButtonAction from '../../components/ButtonAction'
import ContentHeader from '../../components/ContentHeader'
import ClassesController from '../../controllers/classes'

class List extends Component {
  controller = new ClassesController;
  
  constructor(props) {
    super(props)
    this.state = {
      dataTable: {
        thead: ["No", "ClassLevel", "ClassName"],
        tbody: []
      }
    }
  }

  componentDidMount() {
    this.controller.getList()
    .then(res => res.data)
    .then(classes => {
      const tbody = classes.map((val, idx) => ({
        No: idx+1, "ClassLevel" : val.classLevel, "ClassName" : val.className
      }))

        this.setState({
          dataTable: {...this.state.dataTable, tbody: tbody}
        })

      })
    
  }

  render() {
    const { dataTable } = this.state
    return (
      <div className="content-wrapper">
        <ContentHeader title='List Classes' />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">List Classes</h3>
                  <ButtonAction title='Add classes' icon='fas fa-plus' class='btn btn-primary float-right' url='/classes/entry' />
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