import React, { useState, useEffect } from 'react';
import "./testimonials.css";
import { Data } from "./Data";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState(() => {
    // Load testimonials from localStorage on initialization
    const savedTestimonials = localStorage.getItem('testimonials');
    if (savedTestimonials) {
      return JSON.parse(savedTestimonials);
    }
    return Data;
  });
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [userTestimonials, setUserTestimonials] = useState(() => {
    // Load user's own testimonials from localStorage
    const savedUserTestimonials = localStorage.getItem('userTestimonials');
    return savedUserTestimonials ? JSON.parse(savedUserTestimonials) : [];
  });

  // Save testimonials to localStorage whenever testimonials change
  useEffect(() => {
    localStorage.setItem('testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  // Save user testimonials to localStorage
  useEffect(() => {
    localStorage.setItem('userTestimonials', JSON.stringify(userTestimonials));
  }, [userTestimonials]);

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setFormData({
      name: testimonial.title,
      comment: testimonial.description,
      rating: testimonial.rating
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      comment: '',
      rating: 5
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) return;

    setIsSubmitting(true);
    setMessage('');
    
    // Only accept positive reviews (4+ stars)
    if (formData.rating < 4) {
      setMessage('Thank you for your feedback! We appreciate all input and will use it to improve our services.');
      setFormData({
        name: '',
        comment: '',
        rating: 5
      });
      setEditingId(null);
      setIsSubmitting(false);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(''), 5000);
      return;
    }

    if (editingId) {
      // Edit existing testimonial
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === editingId 
            ? {
                ...testimonial,
                title: formData.name,
                description: formData.comment,
                rating: formData.rating
              }
            : testimonial
        )
      );
      setMessage('Your testimonial has been updated successfully!');
      setEditingId(null);
    } else {
      // Create new positive testimonial
      const newTestimonial = {
        id: Date.now(), // Use timestamp for unique ID
        title: formData.name,
        description: formData.comment,
        rating: formData.rating
      };

      // Add to testimonials list
      setTestimonials(prev => [newTestimonial, ...prev]);
      
      // Track user's testimonials
      setUserTestimonials(prev => [...prev, newTestimonial.id]);
      
      setMessage('Thank you for your positive review! It has been added to our testimonials.');
    }
    
    // Reset form
    setFormData({
      name: '',
      comment: '',
      rating: 5
    });
    
    setIsSubmitting(false);
    
    // Clear message after 5 seconds
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <section className="testimonial container section" id='testimonials'>
      <h2 className="section__title">What They Say</h2>
      <span className="section__subtitle">Testimonials</span>

      <Swiper
        className="testimonials__container"
        loop={true}
        grabCursor={true}
        spaceBetween={24}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          576: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 48,
          },
        }}
        modules={[Pagination, Autoplay]}
      >
        {testimonials.map(({ id, title, description, rating }) => {
          const canEdit = userTestimonials.includes(id);
          return (
            <SwiperSlide className="testimonial__card" key={id}>
              {canEdit && (
                <button 
                  className="testimonial__edit-btn"
                  onClick={() => handleEdit({ id, title, description, rating })}
                  title="Edit your testimonial"
                >
                  <i className="bx bx-edit"></i>
                </button>
              )}
              {/* Debug: Show user's testimonial IDs */}
              {canEdit && (
                <div className="testimonial__user-badge">Your Review</div>
              )}
              <h3 className="testimonial__name">{title}</h3>
              <p className="testimonial__description">{description}</p>
              <div className="testimonial__rating">
                {[...Array(5)].map((_, index) => (
                  <i 
                    key={index} 
                    className={`bx ${index < rating ? 'bxs-star' : 'bx-star'} testimonial__star`}
                  ></i>
                ))}
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Testimonial Form */}
      <div className="testimonial__form-container">
        <h3 className="testimonial__form-title">
          {editingId ? 'Edit Your Testimonial' : 'Share Your Experience'}
        </h3>
        
        {message && (
          <div className={`form__message ${message.includes('positive') || message.includes('updated') ? 'form__message--success' : 'form__message--info'}`}>
            {message}
          </div>
        )}
        
        <form className="testimonial__form" onSubmit={handleSubmit}>
          <div className="form__group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className="form__input"
              required
            />
          </div>
          
          <div className="form__group">
            <textarea
              name="comment"
              placeholder="Share your experience..."
              value={formData.comment}
              onChange={handleInputChange}
              className="form__textarea"
              rows="4"
              required
            />
          </div>
          
          <div className="form__group">
            <label className="form__label">Rating:</label>
            <div className="rating__stars">
              {[...Array(5)].map((_, index) => (
                <i
                  key={index}
                  className={`bx ${index < formData.rating ? 'bxs-star' : 'bx-star'} rating__star`}
                  onClick={() => handleRatingChange(index + 1)}
                />
              ))}
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn testimonial__btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : (editingId ? 'Update Testimonial' : 'Submit Testimonial')}
          </button>
          
          {editingId && (
            <button 
              type="button" 
              className="btn btn--secondary testimonial__cancel-btn"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default Testimonials;
