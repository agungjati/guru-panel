import React from 'react'
import { Link } from 'react-router-dom'

const ButtonAction = (props) => {
  return (
    <>
      <Link to={props.url}>
        <button className={props.class}>
          {props.title} &nbsp; <i className={props.icon}></i>
        </button>
      </Link>
    </>
  )
}

export default ButtonAction