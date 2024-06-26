import React, { useEffect } from "react";
import { useState } from "react";
import 'react-toastify/dist/ReactToastify.css'
import { Navigate, Route, Routes } from "react-router-dom";
import { getAuthTOken, getContacts, saveContact, updatePhoto } from "./api/contactService";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import { useRef } from "react";
import ContactDetail from "./components/ContactDetail";
import { toastError, toastSuccess } from "./api/toastService";
import { ToastContainer } from "react-toastify";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";

function App() {
  const modalRef = useRef();
  const fileRef = useRef();
  const [data, setData] = useState({});
  const [currentPage, setcurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',

  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    console.log(values)
  };

  const getAllContacts = async (page = 0, size = 12) => {
    try {
      setcurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };

  const handleNewContact = async(event)=>{
    event.preventDefault();
    try {
      const {data} = await saveContact(values);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', data.id);
      const {data: photoUrl} = await updatePhoto(formData);
      console.log(photoUrl);
      toggleModal(false)
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      })
      getAllContacts();
      
      toastSuccess("Contact is Saved");
    } catch (error) {
      toastError(error.message);
    }
  }

  const toggleModal = (show) => {
    show ? modalRef.current.showModal() : modalRef.current.close();
  };

  const updateContact = async (contact) => {
    try {
      const { data } = await saveContact(contact);
      console.log(data);
    } catch (error) {
      toastError(error.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      const { data: photoUrl } = await updatePhoto(formData);
    } catch (error) {
      toastError(error.message);
    }
  };

  useEffect(() => {
    if(getAuthTOken() != null){
      getAllContacts();
    }
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={"/contacts"} />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={data}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                />
              }
            />
            <Route
              path="/contacts/:id"
              element={
                <ContactDetail
                updateContact = {updateContact}
                updateImage = {updateImage}
                />
              }
            />
            <Route path="/login" element = {<LoginForm/>} />
            <Route path="/register" element = {<RegisterForm/>} />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef}  className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              <div className="input-box">
                <span className="details">Name</span>
                <input
                  type="text"
                  value={values.name}
                  onChange={onChange}
                  name="name"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  type="text"
                  value={values.email}
                  onChange={onChange}
                  name="email"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  type="text"
                  value={values.title}
                  onChange={onChange}
                  name="title"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Phone Number</span>
                <input
                  type="text"
                  value={values.phone}
                  onChange={onChange}
                  name="phone"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Address</span>
                <input
                  type="text"
                  value={values.address}
                  onChange={onChange}
                  name="address"
                  required
                />
              </div>
              <div className="input-box">
                <span className="details">Account Status</span>
                <input
                  type="text"
                  value={values.status}
                  onChange={onChange}
                  name="status"
                  required
                />
              </div>
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  onChange={(event) => setFile(event.target.files[0])
                  }
                  ref={fileRef}
                  name="photo"
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;
