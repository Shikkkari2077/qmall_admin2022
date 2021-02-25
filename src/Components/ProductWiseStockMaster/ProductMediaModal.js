import React from 'react';
import "react-responsive-modal/styles.css";
import { Modal } from 'react-responsive-modal';

class ProductMediaModal extends React.Component {
  state = {}

  render() {
    return (
      <Modal open={this.props.isOpen} onClose={this.props.onCloseModal} center classNames={{ modal: 'customModal', overlay: 'customOverlay' }}>
        <h2>Product Media</h2>
        {
          this.props.product_media !== undefined && this.props.product_media !== null && this.props.product_media !== [] && this.props.product_media.length > 0
            ?
            this.props.product_media.map(media =>
              <img src={media.url} alt="" className="img-100" />
            )
            :
            null
        }
      </Modal>
    );
  }
}

export default ProductMediaModal;