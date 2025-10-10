// Simple cloud testimonials service
class TestimonialsService {
  constructor() {
    this.binId = process.env.REACT_APP_JSONBIN_BIN_ID;
    this.apiUrl = `https://api.jsonbin.io/v3/b/${this.binId}`;
    this.apiKey = process.env.REACT_APP_JSONBIN_API_KEY;
  }

  async getTestimonials() {
    try {
      if (!this.apiKey || !this.binId) {
        console.warn('JSONBin API key or Bin ID not configured');
        return [];
      }
      
      const response = await fetch(this.apiUrl, {
        headers: {
          'X-Master-Key': this.apiKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle different possible response formats
      if (Array.isArray(data.record)) {
        return data.record;
      } else if (data.record && Array.isArray(data.record.testimonials)) {
        return data.record.testimonials;
      } else if (data.record && Array.isArray(data.record.data)) {
        return data.record.data;
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to fetch testimonials from cloud:', error);
      return [];
    }
  }

  async saveTestimonials(testimonials) {
    try {
      if (!this.apiKey || !this.binId) {
        console.warn('JSONBin API key or Bin ID not configured');
        return false;
      }
      
      const response = await fetch(this.apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': this.apiKey
        },
        body: JSON.stringify(testimonials)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('Testimonials saved to cloud successfully');
      return true;
    } catch (error) {
      console.warn('Failed to save testimonials to cloud:', error);
      return false;
    }
  }
}


export { TestimonialsService };