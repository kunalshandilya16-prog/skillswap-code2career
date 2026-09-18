export interface PostGigErrors {
  title?: string;
  category?: string;
  rate?: string;
  description?: string;
  creatorName?: string;
}

export interface BookingFormErrors {
  clientName?: string;
  clientEmail?: string;
  message?: string;
}

export function validateGigForm(data: {
  title: string;
  category: string;
  rate: string | number;
  description: string;
  creatorName: string;
}): { isValid: boolean; errors: PostGigErrors } {
  const errors: PostGigErrors = {};

  const trimmedTitle = data.title.trim();
  if (!trimmedTitle) {
    errors.title = 'Title is required';
  } else if (trimmedTitle.length < 5) {
    errors.title = 'Title must be at least 5 characters long';
  } else if (trimmedTitle.length > 80) {
    errors.title = 'Title must not exceed 80 characters';
  }

  if (!data.category) {
    errors.category = 'Please select a category';
  }

  const numRate = typeof data.rate === 'string' ? parseFloat(data.rate) : data.rate;
  if (data.rate === '' || data.rate === undefined || isNaN(numRate)) {
    errors.rate = 'Rate is required and must be a number';
  } else if (numRate <= 0) {
    errors.rate = 'Rate must be greater than zero';
  } else if (numRate > 1000000) {
    errors.rate = 'Rate exceeds maximum allowed limit';
  }

  const trimmedDesc = data.description.trim();
  if (!trimmedDesc) {
    errors.description = 'Description is required';
  } else if (trimmedDesc.length < 15) {
    errors.description = 'Description should be at least 15 characters to explain your service';
  } else if (trimmedDesc.length > 2000) {
    errors.description = 'Description must not exceed 2000 characters';
  }

  const trimmedCreator = data.creatorName.trim();
  if (!trimmedCreator) {
    errors.creatorName = 'Creator name is required';
  } else if (trimmedCreator.length < 2) {
    errors.creatorName = 'Creator name must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBookingForm(data: {
  clientName: string;
  clientEmail: string;
  message: string;
}): { isValid: boolean; errors: BookingFormErrors } {
  const errors: BookingFormErrors = {};

  const trimmedName = data.clientName.trim();
  if (!trimmedName) {
    errors.clientName = 'Your name is required';
  } else if (trimmedName.length < 2) {
    errors.clientName = 'Name must be at least 2 characters';
  }

  const trimmedEmail = data.clientEmail.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!trimmedEmail) {
    errors.clientEmail = 'Email address is required';
  } else if (!emailRegex.test(trimmedEmail)) {
    errors.clientEmail = 'Please provide a valid email address';
  }

  const trimmedMsg = data.message.trim();
  if (!trimmedMsg) {
    errors.message = 'Please provide details or requirements for your request';
  } else if (trimmedMsg.length < 10) {
    errors.message = 'Request details must be at least 10 characters long';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
