import React, { useState, useEffect } from 'react';
import "./testimonials.css";
import { Data } from "./Data";
import { TestimonialsService } from "../../services/testimonialsService";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';

const Testimonials = () => {
  const testimonialsService = new TestimonialsService();
  
  // Check if localStorage is available and working
  const isLocalStorageAvailable = () => {
    try {
      const testKey = '__localStorage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  };

  const [testimonials, setTestimonials] = useState(() => {
    // Always start with default data and merge with localStorage if available
    let savedTestimonials = [...Data];
    
    if (isLocalStorageAvailable()) {
      try {
        const localData = localStorage.getItem('testimonials');
        if (localData) {
          const parsedData = JSON.parse(localData);
          // Merge saved testimonials with default data, avoiding duplicates
          const existingIds = new Set(Data.map(item => item.id));
          const newTestimonials = parsedData.filter(item => !existingIds.has(item.id));
          savedTestimonials = [...newTestimonials, ...Data];
        }
      } catch (error) {
        console.warn('Failed to load testimonials from localStorage:', error);
      }
    }
    
    return savedTestimonials;
  });
  
  const [formData, setFormData] = useState({
    name: '',
    comment: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [adminMode, setAdminMode] = useState(false);
  const [keySequence, setKeySequence] = useState('');
  const [userTestimonials, setUserTestimonials] = useState(() => {
    if (isLocalStorageAvailable()) {
      try {
        const savedUserTestimonials = localStorage.getItem('userTestimonials');
        return savedUserTestimonials ? JSON.parse(savedUserTestimonials) : [];
      } catch (error) {
        console.warn('Failed to load user testimonials from localStorage:', error);
      }
    }
    return [];
  });

  // Save testimonials to localStorage whenever testimonials change
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem('testimonials', JSON.stringify(testimonials));
      } catch (error) {
        console.warn('Failed to save testimonials to localStorage:', error);
      }
    }
  }, [testimonials]);

  // Save user testimonials to localStorage
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem('userTestimonials', JSON.stringify(userTestimonials));
      } catch (error) {
        console.warn('Failed to save user testimonials to localStorage:', error);
      }
    }
  }, [userTestimonials]);

  // Load testimonials from cloud on component mount
  useEffect(() => {
    const loadCloudTestimonials = async () => {
      try {
        const cloudTestimonials = await testimonialsService.getTestimonials();
        if (cloudTestimonials && cloudTestimonials.length > 0) {
          // Merge cloud testimonials with existing ones, avoiding duplicates
          setTestimonials(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const newCloudTestimonials = cloudTestimonials.filter(item => 
              !existingIds.has(item.id) && !Data.some(d => d.id === item.id)
            );
            return [...newCloudTestimonials, ...prev];
          });
        }
      } catch (error) {
        console.warn('Failed to load testimonials from cloud:', error);
      }
    };

    loadCloudTestimonials();
  }, []);

  // Secret admin access - listen for key sequence
  useEffect(() => {
    const handleKeyPress = (e) => {
      const newSequence = keySequence + e.key.toLowerCase();
      setKeySequence(newSequence);

      // Secret admin code: "admin123"
      if (newSequence.includes('admin123')) {
        setAdminMode(true);
        setMessage('🔓 Admin mode activated! You can now delete any review.');
        setTimeout(() => setMessage(''), 3000);
        setKeySequence('');
      }

      // Reset sequence after 10 characters
      if (newSequence.length > 10) {
        setKeySequence('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [keySequence]);

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

  const handleDelete = async (testimonialId) => {
    // Allow deletion if user owns the testimonial OR admin mode is active
    if (!userTestimonials.includes(testimonialId) && !adminMode) {
      setMessage('You can only delete your own testimonials.');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Confirm deletion
    const isOwnTestimonial = userTestimonials.includes(testimonialId);
    const confirmMessage = adminMode && !isOwnTestimonial 
      ? '🔐 ADMIN DELETE: Are you sure you want to delete this testimonial? This action cannot be undone.'
      : 'Are you sure you want to delete this testimonial? This action cannot be undone.';
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Remove from testimonials list
      const updatedTestimonials = testimonials.filter(t => t.id !== testimonialId);
      setTestimonials(updatedTestimonials);
      
      // Remove from user's testimonials tracking (only if it was their own)
      if (isOwnTestimonial) {
        setUserTestimonials(prev => prev.filter(id => id !== testimonialId));
      }
      
      // Save to cloud (only user-generated testimonials, not default ones)
      try {
        const userOnlyTestimonials = updatedTestimonials.filter(t => !Data.some(d => d.id === t.id));
        await testimonialsService.saveTestimonials(userOnlyTestimonials);
      } catch (error) {
        console.warn('Failed to update cloud after deletion:', error);
      }
      
      const deleteMessage = adminMode && !isOwnTestimonial 
        ? '🔐 Admin deletion successful.' 
        : 'Testimonial deleted successfully.';
      setMessage(deleteMessage);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      setMessage('Failed to delete testimonial. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
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

  const handleSubmit = async (e) => {
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
      const updatedTestimonials = testimonials.map(testimonial => 
        testimonial.id === editingId 
          ? {
              ...testimonial,
              title: formData.name,
              description: formData.comment,
              rating: formData.rating
            }
          : testimonial
      );
      
      setTestimonials(updatedTestimonials);
      
      // Save to cloud
      try {
        await testimonialsService.saveTestimonials(updatedTestimonials.filter(t => !Data.some(d => d.id === t.id)));
      } catch (error) {
        console.warn('Failed to save to cloud:', error);
      }
      
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
      const updatedTestimonials = [newTestimonial, ...testimonials];
      setTestimonials(updatedTestimonials);
      
      // Track user's testimonials
      setUserTestimonials(prev => [...prev, newTestimonial.id]);
      
      // Save to cloud (only user-generated testimonials, not default ones)
      try {
        const userOnlyTestimonials = updatedTestimonials.filter(t => !Data.some(d => d.id === t.id));
        await testimonialsService.saveTestimonials(userOnlyTestimonials);
      } catch (error) {
        console.warn('Failed to save to cloud:', error);
      }
      
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
          const canDelete = canEdit || adminMode;
          return (
            <SwiperSlide className="testimonial__card" key={id}>
              {(canEdit || adminMode) && (
                <div className="testimonial__actions">
                  {canEdit && (
                    <button 
                      className="testimonial__edit-btn"
                      onClick={() => handleEdit({ id, title, description, rating })}
                      title="Edit your testimonial"
                    >
                      <i className="bx bx-edit"></i>
                    </button>
                  )}
                  {canDelete && (
                    <button 
                      className={`testimonial__delete-btn ${adminMode && !canEdit ? 'admin-delete' : ''}`}
                      onClick={() => handleDelete(id)}
                      title={adminMode && !canEdit ? "Admin delete" : "Delete your testimonial"}
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  )}
                </div>
              )}
              {/* Show user badge for own testimonials */}
              {canEdit && (
                <div className="testimonial__user-badge">Your Review</div>
              )}
              {/* Show admin badge when in admin mode for others' testimonials */}
              {adminMode && !canEdit && (
                <div className="testimonial__admin-badge">🔐 Admin</div>
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
