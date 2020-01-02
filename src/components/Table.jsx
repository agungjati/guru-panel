import React, { Component } from 'react'
import ButtonAction from '../components/ButtonAction'

export class Table extends Component {

  render() {
    return (
      <div className="card-body pad">
        <div className="mb-3">
          <table id="example2" className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {this.props.data.map(val => {
                return (
                  <>
                    <tr>
                      <td>{val.id}</td>
                      <td>{val.name}</td>
                      <td>
                        <ButtonAction type="button" title='Edit' class="btn btn-outline-warning btn-sm" icon='fas fa-edit' /> &nbsp;
                        <ButtonAction type="button" title='Delete' class="btn btn-outline-danger btn-sm" icon='fas fa-trash' />
                      </td>
                    </tr>
                  </>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Icon</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    )
  }
}

export default Table