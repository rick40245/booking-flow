# Booking Flow

A modern online booking system built with Vue 3 + TypeScript + Element Plus, providing complete service booking process management.

## ✨ Features

### 🎯 Core Functions
- **Service Selection**: Browse and select different types of service items
- **Multi-person Booking**: Supports multi-person booking mode for main booker + additional bookers
- **Intelligent Scheduling**: Dynamically displays available time slots based on service personnel and date
- **Real-time Validation**: Complete form validation to ensure data accuracy
- **Booking Management**: View, edit, and delete booking records

### 🔧 Advanced Features
- **State Persistence**: Uses Pinia for state management, supports page refresh
- **Route Guards**: Prevents data loss due to accidental user departure
- **Responsive Design**: Adapts to devices with different screen sizes
- **TypeScript Support**: Complete type definitions to enhance development experience
- **ESLint + Prettier**: Code quality assurance

## 🛠 Tech Stack

- **Frontend Framework**: Vue 3 (Composition API)
- **Development Language**: TypeScript
- **UI Framework**: Element Plus
- **State Management**: Pinia + Persistence Plugin
- **Routing Management**: Vue Router 4
- **CSS Framework**: UnoCSS
- **Build Tool**: Vite
- **Testing Framework**: Vitest
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── ConfirmDialog.vue   # Confirmation dialog
│   └── PageContainer.vue  # Page container
├── constants/           # Constant definitions
│   └── booking.ts          # Booking-related constants
├── router/              # Routing configuration
│   └── index.ts            # Route definitions
├── stores/              # Pinia state management
│   ├── bookingStore.ts     # Booking state
│   ├── servicesStore.ts    # Service state
│   └── uiStore.ts          # UI state
├── types/               # TypeScript type definitions
│   ├── booking.ts          # Booking-related types
│   └── form-validation.ts  # Form validation types
├── utils/               # Utility functions
│   ├── date.ts             # Date processing
│   └── validation.ts       # Form validation
├── views/               # Page components
│   ├── PageServiceList.vue # Service selection page
│   ├── PageBookingForm.vue # Booking form page
│   └── PageBookingSummary.vue # Booking summary page
├── App.vue              # Root component
└── main.ts              # Application entry point
```

## 🚀 Quick Start

### Environment Requirements

- Node.js 18+
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

After startup, visit [http://localhost:5173](http://localhost:5173)

### Build Production Version

```bash
npm run build
```

### Preview Production Version

```bash
npm run preview
```

## 🧪 Testing and Quality

### Run Unit Tests

```bash
npm run test:unit
```

### Code Linting

```bash
npm run lint
```

### Code Formatting

```bash
npm run format
```

### Type Checking

```bash
npm run type-check
```

## 📱 Usage Flow

1. **Select Service**: Choose the desired service item from the service list
2. **Fill Information**: Enter the number of people, personal information, and select service personnel
3. **Select Time**: Pick a suitable booking date and time slot
4. **Confirm Booking**: Check booking details and submit
5. **Manage Booking**: View, edit, or delete bookings on the summary page

## 🎨 Development Guidelines

### Code Style
- Develop using TypeScript
- Follow ESLint and Prettier specifications
- Adopt Composition API style
- Components use `<script setup>` syntax

### Naming Conventions
- Components: PascalCase (e.g., `PageContainer.vue`)
- Files/Directories: kebab-case (e.g., `booking-form`)
- Variables/Functions: camelCase (e.g., `isLoading`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_PEOPLE`)
