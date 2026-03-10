"use client";
import { useState } from "react";
import { Spinner, Alert } from "react-bootstrap";

function PlanVisitContactForm() {
  const [spinner, setSpinner] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "",
    heading: "",
  });
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bringingKids: "",
    questions: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSpinner(true);
    try {
      const response = await fetch("/api/plan-visit-send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          bringingKids: form.bringingKids,
          questions: form.questions,
        }),
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
    <div className="plan-visit-form-container">
      <div className="contact-form">
        <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
          <div className="name-fields">
            <div className="name-fields-individual">
              <label htmlFor="firstName" className="form-label">
                First Name (required)
              </label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, firstName: e.target.value })}
                value={form.firstName}
                required
              />
            </div>
            <div className="name-fields-individual">
              <label htmlFor="lastName" className="form-label">
                Last Name (required)
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, lastName: e.target.value })}
                value={form.lastName}
                required
              />
            </div>
          </div>
          <div className="mb-3 mt-5 mb-5">
            <label htmlFor="email" className="form-label">
              Email Address (required)
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
              value={form.email}
              required
            />
          </div>
          <div className="mb-3 mt-5 mb-5">
            <label htmlFor="phone" className="form-label">
              Phone/Text Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })}
              value={formatPhoneNumber(form.phone)}
            />
          </div>
          <div className="mb-3 mt-5 mb-5">
            <label htmlFor="bringingKids" className="form-label mb-1">
              Bringing Kids?
            </label>
            <small className="d-block text-muted mb-1 small-text">Great! Let us know their names and ages.</small>
            <textarea
              rows={4}
              className="form-control"
              id="bringingKids"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, bringingKids: e.target.value })}
              value={form.bringingKids}
            />
          </div>
          <div className="mb-3 mt-5 mb-5">
            <label htmlFor="questions" className="form-label">
              Questions/Comments?
            </label>
            <textarea
              rows={4}
              className="form-control"
              id="questions"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, questions: e.target.value })}
              value={form.questions}
            />
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
    </div>
  );
}

export default PlanVisitContactForm;
