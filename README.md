# Equity Tax Dashboard

A comprehensive tax management system with admin and user dashboards, similar to TurboTax. Built with React, TypeScript, and Tailwind CSS.

## Features

### User Dashboard
- **Tax Filing**: Step-by-step tax return process with form validation
- **Document Upload**: Secure document upload with drag-and-drop functionality
- **Tax History**: View previous tax returns and filing history
- **Profile Management**: Update personal information and preferences
- **Progress Tracking**: Real-time status updates and progress indicators

### Admin Dashboard
- **User Management**: View, search, and manage user accounts
- **Tax Return Review**: Review and approve/reject submitted tax returns
- **Analytics**: Comprehensive platform analytics and performance metrics
- **Settings**: Configure system settings, security, and integrations
- **Real-time Monitoring**: Track user activity and system performance

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Charts**: Recharts
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd equity-tax-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Demo Credentials

**Admin Access:**
- Email: `admin@equitytax1.com`
- Password: `password`

**User Access:**
- Email: `user@equitytax1.com`
- Password: `password`

## Project Structure

```
src/
├── components/
│   ├── admin/           # Admin dashboard components
│   │   ├── AdminDashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── TaxReturnReview.tsx
│   │   ├── Analytics.tsx
│   │   └── AdminSettings.tsx
│   ├── auth/            # Authentication components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── ProtectedRoute.tsx
│   └── user/            # User dashboard components
│       ├── UserDashboard.tsx
│       ├── TaxFiling.tsx
│       ├── DocumentUpload.tsx
│       ├── TaxHistory.tsx
│       └── Profile.tsx
├── contexts/            # React contexts
│   └── AuthContext.tsx
├── App.tsx              # Main app component
├── index.tsx            # App entry point
└── index.css            # Global styles
```

## Key Features

### Authentication System
- Secure login/signup with role-based access
- Protected routes for admin and user areas
- Session management with localStorage

### User Experience
- Modern, responsive design
- Intuitive navigation with sidebar menus
- Real-time form validation
- Progress indicators and status updates
- Drag-and-drop file uploads

### Admin Capabilities
- Comprehensive user management
- Tax return review and approval workflow
- Detailed analytics and reporting
- System configuration and settings
- Bulk operations and data export

### Security Features
- Role-based access control
- Secure document handling
- Input validation and sanitization
- Protected API endpoints (ready for backend integration)

## Customization

### Styling
The application uses Tailwind CSS with a custom color scheme. You can modify the colors in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Your primary color palette
  },
  secondary: {
    // Your secondary color palette
  }
}
```

### Configuration
Update the demo credentials and default settings in `src/contexts/AuthContext.tsx` and the respective component files.

## Deployment

### Build for Production
```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=your-api-url
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-key
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## Future Enhancements

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Advanced tax calculations
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced reporting features
- [ ] Integration with tax authorities
- [ ] Automated tax form generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@equitytax1.com or create an issue in the repository.

---

**Note**: This is a frontend application with mock data. For production use, integrate with a backend API and implement proper security measures.
