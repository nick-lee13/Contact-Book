import { useEffect, useState } from "react";
import crypto from 'crypto';

const ContactForm = ({
  visible,
  selectedIndex,
  contactData,
  onUpdateData,
  onCloseModal,
}: {
  visible: boolean;
  selectedIndex: number;
  contactData: any;
  onUpdateData: any;
  onCloseModal: any;
}) => {
  const newData = {
    id: crypto.randomBytes(16).toString('hex'),
    fName: "",
    lName: "",
    email: "",
    phone: "",
    imageUrl: "",
  };
  const [tempData, setTempData] = useState<Contact>(newData);

  let modal_title = "Add New Contact";

  useEffect(() => {

    if (selectedIndex != -1) {
      modal_title = "Update Contact";
      setTempData(contactData[selectedIndex]);
    } else {
      setTempData(newData);
    }
  }, [visible]);

  const [validationErrors, setValidationErrors] = useState({
    fName: "",
    email: "",
    phone: "",
    imageUrl: "",
  });

  // Validate required data in form
  const validateForm = () => {
    let isValid = true; //Any errors changes this to false
    //Stores errors found
    const errors = {
      fName: "",
      email: "",
      phone: "",
      imageUrl: "",
    };

    if(!tempData.fName){
      errors.fName = "First Name Required!";
      isValid = false;
    }
    if(!tempData.email && !tempData.phone){
      errors.phone = "Email or Phone Number Required!";
      errors.email = "Email or Phone Number Required!";
      isValid = false;
    }
    if(tempData.email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tempData.email)){
      errors.email = "Invalid email format!";
      isValid = false;
    }
    if(tempData.phone && !/^\d{10}$/.test(tempData.phone)){
      errors.phone = "Invalid phone format! (10 digits)";
      isValid = false;
    }
    if(tempData.imageUrl){
      if (!/\.(jpg|jpeg|png|gif)$/i.test(tempData.imageUrl)) {
        errors.imageUrl = "Invalid image URL";
        isValid = false;
      }
    }

    setValidationErrors(errors);
    return isValid;
  };

  return (
    <>
      {visible && (
        <div className="modal fade show">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modal_title}</h5>
                <button
                  onClick={onCloseModal}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if(validateForm()){
                    onUpdateData(tempData);
                  }
                }}>
                  <div className="mb-3">
                    <label className="form-label">First Name:</label>
                    <input
                      className="form-control"
                      name="fName"
                      type="text"
                      value={tempData.fName}
                      onChange={(e) =>
                        setTempData({ ...tempData, fName: e.target.value })
                      }
                    />
                    <div className="text-danger">{validationErrors.fName}</div>
                  </div>
                  <div>
                    <label>Last Name:</label>
                    <input
                      className="form-control"
                      name="lName"
                      type="text"
                      value={tempData.lName}
                      onChange={(e) =>
                        setTempData({ ...tempData, lName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Email:</label>
                    <input
                      className="form-control"
                      name="email"
                      type="text"
                      value={tempData.email}
                      onChange={(e) =>
                        setTempData({ ...tempData, email: e.target.value })
                      }
                    />
                    <div className="text-danger">{validationErrors.email}</div>
                  </div>
                  <div>
                    <label>Phone #:</label>
                    <input
                      className="form-control"
                      name="phone"
                      type="text"
                      value={tempData.phone}
                      onChange={(e) =>
                        setTempData({ ...tempData, phone: e.target.value })
                      }
                    />
                    <div className="text-danger">{validationErrors.phone}</div>
                  </div>
                  <div>
                    <label>Image Url:</label>
                    <input
                      className="form-control"
                      name="imageUrl"
                      type="text"
                      value={tempData.imageUrl}
                      onChange={(e) =>
                        setTempData({ ...tempData, imageUrl: e.target.value })
                      }
                    />
                    <div className="text-danger">{validationErrors.imageUrl}</div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  onClick={onCloseModal}
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactForm;
