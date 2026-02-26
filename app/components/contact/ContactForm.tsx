"use client";
import React from "react";

function ContactForm() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className="contact-form">
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="floatingInput" placeholder="Name" required />
          <label htmlFor="floatingInput">Name</label>
        </div>
        <div className="form-floating mb-3">
          <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com/" required />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="floatingInput" placeholder="(803 555-5555)" required />
          <label htmlFor="floatingInput">Phone/Text Number</label>
        </div>
        <div className="form-floating">
          <textarea rows={6} className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
          <label htmlFor="floatingTextarea">Prayer Request/Request Information/Answer a question</label>
        </div>
        <button type="submit" className="btn btn-primary mt-3 rounded w-100 p-3 submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
