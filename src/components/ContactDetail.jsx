import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getContact, updatePhoto } from "../api/contactService";
import { toastError, toastSuccess } from "../api/toastService";

function ContactDetail({ updateContact, updateImage }) {
  const inputRef = useRef();
  const [contact, setContact] = useState({
    id: '',
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
    photoUrl: "",
  });
  const { id } = useParams();
  console.log(id);

  const getContactById = async (id) => {
    try {
      const { data } = await getContact(id);
      setContact(data);
      console.log(data);
    } catch (error) {
      toastError(error.message);
    }
  };

  const uploadPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", id);
      await updateImage(formData);
      setContact((prev)=> ({...prev, photoUrl: `${prev.photoUrl}?&updated_at=${new Date().getTime()}`}))
      // console.log(data);
      toastSuccess("Photo Updated!!");
    } catch (error) {
      console.log(error);
      toastError(error.message);
    }
  };


  const onChange = (event) => {
    setContact({ ...contact, [event.target.name]: event.target.value });
  };

  const onUpdateContact = async(event) => {
    event.preventDefault();
    await updateContact(contact);
    console.log(values);
    getContactById(id);
    toastSuccess("Contact Updated!!");
  };

  const selectImage = () => {
    inputRef.current.click();
  };

  useEffect(() => {
    getContactById(id);
  }, []);

  return (
    <>
      <Link to={"/contacts"} className="link">
        <i className="bi bi-arrow-left"> Back to list</i>
      </Link>
      <div className="profile">
        <div className="profile__details">
          <img
            src={contact.photoUrl}
            alt={`Profile photo of ${contact.name}`}
          />
          <div className="profile__metadata">
            <p className="profile__name">{contact.name}</p>
            <p className="profile__muted">JPG, GIF, or PNG. Max Size of 10Mb</p>
            <button onClick={selectImage} className="btn">
              <i className="bi bi-cloud-upload"></i> Change Photo
            </button>
          </div>
        </div>
        <div className='profile__settings'>
                    <div>
                        <form onSubmit={onUpdateContact}  className="form">
                            <div className="user-details">
                                <input type="hidden" defaultValue={contact.id} name="id" required />
                                <div className="input-box">
                                    <span className="details">Name</span>
                                    <input type="text" value={contact.name} onChange={onChange} name="name" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Email</span>
                                    <input type="text" value={contact.email} onChange={onChange}  name="email" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Phone</span>
                                    <input type="text" value={contact.phone} onChange={onChange}  name="phone" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Address</span>
                                    <input type="text" value={contact.address} onChange={onChange} name="address" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Title</span>
                                    <input type="text" value={contact.title} onChange={onChange}  name="title" required />
                                </div>
                                <div className="input-box">
                                    <span className="details">Status</span>
                                    <input type="text" value={contact.status} onChange={onChange} name="status" required />
                                </div>
                            </div>
                            <div className="form_footer">
                                <button type="submit" className="btn">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
      </div>
      <form style={{ display: "none" }}>
        <input
          type="file"
          ref={inputRef}
          onChange={(event) => uploadPhoto(event.target.files[0])}
          name="file"
          accept="image/*"
        />
      </form>
    </>
  );
}

export default ContactDetail;
