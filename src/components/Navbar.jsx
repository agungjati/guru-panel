import React from 'react';

class Navbar extends React.Component {

  render() {

    return (<nav className="main-header navbar navbar-expand navbar-white navbar-light">
      <ul className="navbar-nav">
        <li className="nav-item">
          <a className="nav-link" data-widget="pushmenu"><i className="fas fa-bars"></i></a>
        </li>
      </ul>

      <form className="form-inline ml-3">
        <div className="input-group input-group-sm">
          <input className="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
          <div className="input-group-append">
            <button className="btn btn-navbar" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </form>

      <ul className="navbar-nav ml-auto">
        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown" href="#">
            <i className="far fa-user-circle"></i>
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <a className="dropdown-item">
              <i className="fas fa-user mr-2"></i>Profile</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item">
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </a>
          </div>
        </li>
      </ul>
    </nav>)
  }
}

export default Navbar;
