import React, { Component } from 'react'
import Table from '../../components/Table'
import ButtonAction from '../../components/ButtonAction'
import ContentHeader from '../../components/ContentHeader'

class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [
        {id:1,name:'list courses 1'},
        {id:2,name:'list courses 2'},
      ]
    }
  }

  render() {
    const { data } = this.state 
    return (
      <div className="content-wrapper">
        <ContentHeader title='List Chapters' />
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">List Chapters</h3>
                  <ButtonAction title='Add chapters' icon='fas fa-plus' class='btn btn-primary float-right' url='/add-courses' />
                </div>
                <Table data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List
