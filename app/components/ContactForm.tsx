"use client";
import { useState } from "react";
import { Spinner, Alert } from "react-bootstrap";

function ContactForm() {
  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "",
    heading: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    comments: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinner(true);
    try {
      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, comments: form.comments }),
      });

      if (response.ok) {
        setSpinner(false);
        setAlert({
          ...alert,
          show: true,
          variant: "success",
          heading: "Message Sent!",
          message: `Thank you for getting in touch with us. Your message is important and a member of our team will be in contact with you shortly.`,
        });
        console.log("Success: ", response);
      }
    } catch (error) {
      setSpinner(false);
      setAlert({
        ...alert,
        show: true,
        variant: "danger",
        heading: "Ooops! Something went wrong!",
        message: `Something went wrong with the submission process. Please check the information and try again.`,
      });
      console.log("Fail: ", error);
    }
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    let text = phoneNumber.replace(/\D/g, "");

    // Format as (XXX) XXX-XXXX
    if (text.length > 3) {
      text = text.replace(/^(\d{3})(\d{0,3})/, "($1) $2");
    }

    // Insert hyphen after the third group of digits
    if (text.length > 6 && text.charAt(6) !== "-") {
      text = text.replace(/^(\(\d{3}\)) (\d{3})/, "$1 $2-");
    }

    // Handle backspacing after hyphen
    if (text.length < 11 && text.charAt(9) === "-") {
      text = text.substring(0, 9) + text.substring(10); // Remove the hyphen
    }

    text = text.substring(0, 14);

    return text;
  };

  return (
    <div className="contact-form">
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="Name"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
            value={form.name}
            required
          />
          <label htmlFor="floatingInput">Name</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="name@example.com/"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
            value={form.email}
            required
          />
          <label htmlFor="floatingInput">Email address</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="floatingInput"
            placeholder="(803 555-5555)"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })}
            value={formatPhoneNumber(form.phone)}
            required
          />
          <label htmlFor="floatingInput">Phone/Text Number</label>
        </div>
        <div className="form-floating">
          <textarea
            rows={6}
            className="form-control"
            placeholder="Leave a comment here"
            id="floatingTextarea"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, comments: e.target.value })}
            value={form.comments}
          ></textarea>
          <label htmlFor="floatingTextarea">Prayer Request/Request Information/Answer a question</label>
        </div>
        <button type="submit" className="btn btn-primary mt-3 rounded w-100 p-3 submit-btn">
          Submit {spinner ? <Spinner animation="border" role="status" className="ms-2" /> : null}
        </button>
      </form>
      {alert.show ? (
        <Alert
          className="mt-3"
          variant={alert.variant}
          onClose={() =>
            setAlert({
              ...alert,
              show: false,
              heading: "",
              variant: "",
              message: "",
            })
          }
          dismissible
        >
          <Alert.Heading>{alert.heading}</Alert.Heading>
          <p>{alert.message}</p>
        </Alert>
      ) : null}
    </div>
  );
}

export default ContactForm;
