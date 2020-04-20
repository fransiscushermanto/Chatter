import React from "react";

const Modal = ({ text, setOpenModal, onAction, actionText }) => {
  return (
    <div className="delete-modal-popup">
      <div className="delete-modal-wrapper">
        <div className="inner-wrapper">
          <div className="notif-title">
            <span>{text}</span>
          </div>
          <div className="action-button">
            <div
              className="cancel"
              onClick={() => setOpenModal(false)}
              role="button"
            >
              CANCEL
            </div>
            <div className="delete" onClick={onAction} role="button">
              {actionText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
