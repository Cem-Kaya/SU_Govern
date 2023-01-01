import React from 'react'

const Spinner = () => {
  return (
    <div className="d-flex justify-content-center">
        <div className="spinner-border text-light" role="status">
            {/* <span class="sr-only">Loading...</span> */}
        </div>
    </div>
  )
}

export default Spinner