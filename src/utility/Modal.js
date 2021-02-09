import React from 'react';
import '../styles/Modal.scss';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// stores the ref to the returned component
let elementRef = null;
// component
class ModalComponent extends React.Component {
    state = {
        item: null
    };
    showModal = (item) => this.setState({item});
    closeModal = () => this.setState({item: null});
    render = () => (
        <div className="modal">
            {this.state.item && 
            <div className="modal-content">
                <div className="closeButtonContainer">
                    <button onClick={closeModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="modal-body">
                    {this.state.item}
                </div>
            </div>}
        </div>
    );
};

// create the modal component
class Modal extends React.Component{
    render = () => {
        return <ModalComponent ref={el => elementRef = el} />
    };
};
// export the modal component
export default Modal;

// provide methods for user interaction
export const showModal = (item) => {
    if (!elementRef)    throw new Error("<Modal /> component should be rendered for addToast");
    return elementRef.showModal(item);
}
// provide methods for user interaction
export const closeModal = () => {
    if (!elementRef)    throw new Error("<Modal /> component should be rendered for addToast");
    return elementRef.closeModal();
}