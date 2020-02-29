import React from "react";

export default class DashboardPage extends React.Component {
  render() {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Starter Page</h1>
              </div>
             
            </div>
          </div>
        </div>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-8">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title mb-2">Hi Admin!</h5>
                    <p className="card-text">
                      We hope you are making progress on your project... <br />
                      Feel free to read the latest new about Strapi. <br />
                      We are giving our best to improve the product based on
                      your feedback.
                      <br />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
