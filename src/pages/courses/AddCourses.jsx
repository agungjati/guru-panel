import React, { Component } from 'react'
import ButtonAction from '../../components/ButtonAction'
import ContentHeader from '../../components/ContentHeader'

class AddCourses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSelect: [
        { id: 1, name: 'select 1' },
        { id: 2, name: 'select 2' },
        { id: 3, name: 'select 3' },
        { id: 4, name: 'select 4' },
      ]
    }
  }

  render () {
    const { dataSelect } = this.state
    return (
      <div className="content-wrapper">

        <div className='col-md-12'>
          <div className='row'>
            <div className='col-md-10'>
              <ContentHeader title="Add Chapters" />
            </div>
            <div className='col-md-2 p-2'>
              <div className='row p-2'>
                <div className='col-md-6'>
                  <ButtonAction title='Reset' class='btn btn-block btn-default' />
                </div>
                <div className='col-md-6'>
                  <ButtonAction title='Save' class='btn btn-block btn-success ' />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className='row'>
                <div className='col-md-6'>
                  <div className="card">
                    <div className="card-header">
                      <h3 className="card-title mb-0">Add Chapters</h3>
                    </div>
                    <div className="card-body pad">
                      <div className="form-group">
                        <label for="inputName">Chapter Name</label>
                        <input type="text" id="inputName" className="form-control" name='name' />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className="card">
                    <div className="card-body pad">
                      {[0, 1, 2, 3].map(val => {
                        return (
                          <div class="form-group" key={val}>
                            <label for="inputStatus">Curiculum</label>
                            <select className="form-control custom-select">
                              <option selected="" disabled="">Select one</option>
                              <option>On Hold</option>
                              <option>Canceled</option>
                              <option>Success</option>
                            </select>
                          </div>
                        )
                      })}

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

export default AddCourses
