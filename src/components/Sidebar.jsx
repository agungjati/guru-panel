import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4 position-fixed">
      <a className="brand-link">
        <img
          src="/dist/img/AdminLTELogo.png"
          alt="AdminLTE Logo"
          className="brand-image img-circle elevation-3"
        />
        <span className="brand-text font-weight-light">Guru Ahli</span>
      </a>
      <div className="sidebar">
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
            data-accordion="false"
          >
            <li className="nav-item">
              <Link to="/quiz" className="nav-link">
                <i className="nav-icon far fa-edit"></i>
                <p>Quizzes</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/question-sources" className="nav-link">
                <i className="nav-icon far fa-edit"></i>
                <p>Question Sources</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/questions" className="nav-link">
                <i className="nav-icon far fa-edit"></i>
                <p>Questions</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
