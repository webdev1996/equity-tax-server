const mongoose = require('mongoose');

const taxReturnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taxYear: {
    type: Number,
    required: [true, 'Tax year is required'],
    min: [2020, 'Tax year must be 2020 or later'],
    max: [new Date().getFullYear(), 'Tax year cannot be in the future']
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'under_review', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    ssn: {
      type: String,
      required: [true, 'SSN is required'],
      select: false
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required']
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required']
      },
      city: {
        type: String,
        required: [true, 'City is required']
      },
      state: {
        type: String,
        required: [true, 'State is required']
      },
      zipCode: {
        type: String,
        required: [true, 'ZIP code is required']
      }
    },
    filingStatus: {
      type: String,
      enum: ['single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household', 'qualifying_widow'],
      required: [true, 'Filing status is required']
    }
  },
  income: {
    wages: {
      type: Number,
      default: 0,
      min: [0, 'Wages cannot be negative']
    },
    interest: {
      type: Number,
      default: 0,
      min: [0, 'Interest cannot be negative']
    },
    dividends: {
      type: Number,
      default: 0,
      min: [0, 'Dividends cannot be negative']
    },
    business: {
      type: Number,
      default: 0,
      min: [0, 'Business income cannot be negative']
    },
    rental: {
      type: Number,
      default: 0,
      min: [0, 'Rental income cannot be negative']
    },
    other: {
      type: Number,
      default: 0,
      min: [0, 'Other income cannot be negative']
    }
  },
  deductions: {
    type: {
      type: String,
      enum: ['standard', 'itemized'],
      default: 'standard'
    },
    standardAmount: {
      type: Number,
      default: 13850 // 2023 standard deduction
    },
    itemized: {
      mortgageInterest: {
        type: Number,
        default: 0,
        min: [0, 'Mortgage interest cannot be negative']
      },
      propertyTax: {
        type: Number,
        default: 0,
        min: [0, 'Property tax cannot be negative']
      },
      charitable: {
        type: Number,
        default: 0,
        min: [0, 'Charitable contributions cannot be negative']
      },
      medical: {
        type: Number,
        default: 0,
        min: [0, 'Medical expenses cannot be negative']
      },
      stateTax: {
        type: Number,
        default: 0,
        min: [0, 'State tax cannot be negative']
      }
    }
  },
  calculations: {
    totalIncome: {
      type: Number,
      default: 0
    },
    totalDeductions: {
      type: Number,
      default: 0
    },
    taxableIncome: {
      type: Number,
      default: 0
    },
    taxOwed: {
      type: Number,
      default: 0
    },
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  submittedAt: {
    type: Date,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reviewComments: {
    type: String,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  dueDate: {
    type: Date,
    required: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    submissionMethod: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
taxReturnSchema.index({ user: 1, taxYear: 1 });
taxReturnSchema.index({ status: 1 });
taxReturnSchema.index({ priority: 1 });
taxReturnSchema.index({ submittedAt: -1 });
taxReturnSchema.index({ dueDate: 1 });

// Virtual for full name
taxReturnSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Virtual for days until due
taxReturnSchema.virtual('daysUntilDue').get(function() {
  const today = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue
taxReturnSchema.virtual('isOverdue').get(function() {
  return this.daysUntilDue < 0;
});

// Pre-save middleware to calculate totals
taxReturnSchema.pre('save', function(next) {
  // Calculate total income
  this.calculations.totalIncome = 
    this.income.wages +
    this.income.interest +
    this.income.dividends +
    this.income.business +
    this.income.rental +
    this.income.other;

  // Calculate total deductions
  if (this.deductions.type === 'standard') {
    this.calculations.totalDeductions = this.deductions.standardAmount;
  } else {
    this.calculations.totalDeductions = 
      this.deductions.itemized.mortgageInterest +
      this.deductions.itemized.propertyTax +
      this.deductions.itemized.charitable +
      this.deductions.itemized.medical +
      this.deductions.itemized.stateTax;
  }

  // Calculate taxable income
  this.calculations.taxableIncome = Math.max(0, 
    this.calculations.totalIncome - this.calculations.totalDeductions
  );

  // Calculate tax owed (simplified tax brackets for 2023)
  this.calculations.taxOwed = this.calculateTax(this.calculations.taxableIncome);

  // Calculate refund (assuming no payments made for simplicity)
  this.calculations.refundAmount = Math.max(0, -this.calculations.taxOwed);

  next();
});

// Method to calculate tax based on 2023 brackets
taxReturnSchema.methods.calculateTax = function(taxableIncome) {
  if (taxableIncome <= 0) return 0;

  // 2023 tax brackets for single filers (simplified)
  const brackets = [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 }
  ];

  let tax = 0;
  let remainingIncome = taxableIncome;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return Math.round(tax * 100) / 100; // Round to 2 decimal places
};

// Method to submit return
taxReturnSchema.methods.submit = function() {
  this.status = 'pending';
  this.submittedAt = new Date();
  return this.save();
};

// Method to approve return
taxReturnSchema.methods.approve = function(reviewerId, comments = null) {
  this.status = 'approved';
  this.reviewedAt = new Date();
  this.reviewedBy = reviewerId;
  this.reviewComments = comments;
  return this.save();
};

// Method to reject return
taxReturnSchema.methods.reject = function(reviewerId, reason, comments = null) {
  this.status = 'rejected';
  this.reviewedAt = new Date();
  this.reviewedBy = reviewerId;
  this.rejectionReason = reason;
  this.reviewComments = comments;
  return this.save();
};

// Static method to find by user and year
taxReturnSchema.statics.findByUserAndYear = function(userId, year) {
  return this.findOne({ user: userId, taxYear: year });
};

// Static method to find pending returns
taxReturnSchema.statics.findPending = function() {
  return this.find({ status: 'pending' }).populate('user', 'name email');
};

// Static method to find by status
taxReturnSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('user', 'name email');
};

module.exports = mongoose.model('TaxReturn', taxReturnSchema);
