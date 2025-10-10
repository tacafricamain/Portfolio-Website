import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './contact.css';

const Contact = () => {
  const form = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Check if environment variables are available
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    console.log('EmailJS Config Check:', {
      serviceId: serviceId ? 'Set' : 'Missing',
      templateId: templateId ? 'Set' : 'Missing',
      publicKey: publicKey ? 'Set' : 'Missing',
      nodeEnv: process.env.NODE_ENV
    });

    // Fallback configuration for production if env vars are missing
    const config = {
      serviceId: serviceId || 'service_txyz5zh',
      templateId: templateId || 'template_z4nppyw', 
      publicKey: publicKey || 'Cp7gyTlJZdqWp3rve'
    };

    if (!serviceId || !templateId || !publicKey) {
      console.error('Missing EmailJS configuration');
      setMessage('Email service is not properly configured. Please contact directly via email or social media.');
      setIsLoading(false);
      return;
    }

    emailjs.sendForm(
      config.serviceId,
      config.templateId,
      form.current,
      config.publicKey
    )
    .then(
      (result) => {
        console.log('Email sent successfully:', result.text);
        setMessage('Message sent successfully! Thank you for reaching out.');
        form.current.reset();
      },
      (error) => {
        console.error('EmailJS Error:', error);
        console.error('Error details:', {
          name: error.name,
          message: error.text || error.message,
          status: error.status,
          serviceId: config.serviceId,
          templateId: config.templateId
        });
        
        // Provide more specific error messages
        if (error.status === 400) {
          setMessage('Invalid email configuration. Please check the form fields and try again.');
        } else if (error.status === 401) {
          setMessage('Email service authentication failed. Please contact directly via email.');
        } else if (error.status === 402) {
          setMessage('Email service quota exceeded. Please try again later or contact directly.');
        } else if (error.status === 404) {
          setMessage('Email service not found. Please contact directly via email or social media.');
        } else {
          setMessage('Failed to send message. Please try contacting directly via email or social media.');
        }
      }
    )
    .finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <section className="contact section" id="contact">
      <h2 className="section__title">Get in touch</h2>
      <span className="section__subtitle">Contact Me</span>

      <div className="contact__container container grid">
        <div>
          <div className="contact__information">
            <i className="uil uil-phone contact__icon"></i>

            <div>
              <h3 className="contact__title">Call Me</h3>
              <span className="contact__subtitle">+234 810 123 4567</span>
            </div>
          </div>

          <div className="contact__information">
            <i className="uil uil-envelope contact__icon"></i>

            <div>
              <h3 className="contact__title">Email</h3>
              <span className="contact__subtitle">jahswill@example.com</span>
            </div>
          </div>

          <div className="contact__information">
            <i className="uil uil-map-marker contact__icon"></i>

            <div>
              <h3 className="contact__title">Location</h3>
              <span className="contact__subtitle">Lagos, Nigeria</span>
            </div>
          </div>
        </div>

        <form ref={form} onSubmit={sendEmail} className="contact__form grid">
          <div className="contact__inputs grid">
            <div className="contact__content">
              <label className="contact__label">Name</label>
              <input type="text" name="from_name" className="contact__input" required />
            </div>
            <div className="contact__content">
              <label className="contact__label">Email</label>
              <input type="email" name="from_email" className="contact__input" required />
            </div>
          </div>
          <div className="contact__content">
            <label className="contact__label">Project</label>
            <input type="text" name="project" className="contact__input" />
          </div>
          <div className="contact__content">
            <label className="contact__label">Message</label>
            <textarea 
              name="message" 
              cols="0" 
              rows="7" 
              className="contact__input"
              required
            ></textarea>
          </div>

          {message && (
            <div className={`contact__message ${message.includes('successfully') ? 'contact__message--success' : 'contact__message--error'}`}>
              {message}
            </div>
          )}

          <div>
            <button 
              type="submit" 
              className="button button--flex"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Sending...
                  <i className="uil uil-spinner-alt button__icon spinning"></i>
                </>
              ) : (
                <>
                  Send Message
                  <i className="uil uil-message button__icon"></i>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
