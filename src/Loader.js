import React from "react";
import { CircleLoading  } from 'react-loadingg';

class Loader extends React.Component {
  render() {
    return (
      <div className="loader-block">
        <CircleLoading  />
      </div>
    )
  }
}

export default Loader;