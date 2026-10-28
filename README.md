# The Gentlemen's Cut – Barber Shop Booking Website

**Sharp Cuts. Timeless Style.**

## Project Overview

The Gentlemen's Cut is a full-stack barber shop website developed to provide customers with an easy and convenient way to explore barber shop services, view barber profiles, and book appointments online.

The project combines a responsive user interface with a server-side application and database to manage booking information. It was developed as a practical web development project to demonstrate my skills in frontend development, backend programming, database management, and application deployment.

## Live Demo

**Website:** https://gentlemens-cut.onrender.com/

## Features

- **Responsive Website:** Designed to provide a user-friendly experience across desktop and mobile devices.
- **Services Page:** Displays available barber shop services.
- **Barber Profiles:** Allows customers to explore barber information.
- **Online Appointment Booking:** Enables customers to submit appointment details through the website.
- **Booking Validation:** Validates booking information before processing appointments.
- **Appointment Conflict Prevention:** Helps prevent conflicting appointments for the same barber and time slot.
- **Database Integration:** Uses SQLite to store and manage appointment information.
- **Google Calendar Integration:** Supports appointment calendar integration.
- **Contact Information:** Provides customers with access to barber shop contact details.
- **Professional UI:** Uses a modern design to create a consistent barber shop brand experience.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Frontend interactivity and client-side functionality |
| Node.js | Server-side JavaScript runtime |
| Express.js | Backend routing and HTTP request handling |
| SQLite | Database storage |
| Google Calendar API/integration | Appointment calendar functionality |
| Git and GitHub | Version control and source code management |
| Render | Website deployment and hosting |

## Project Structure

```text
Gentlemens-Cut/
├── public/              # Frontend assets and website files
├── server.js            # Express application entry point
├── package.json         # Project metadata and dependencies
├── package-lock.json    # Dependency lock file
└── README.md            # Project documentation
```

*Note: The directory structure above is illustrative. Adjust it to match the actual files and folders in your repository.*

## How It Works

1. Customers visit the website and browse the available services.
2. They explore the barber profiles and choose their preferred service.
3. Customers enter their appointment details through the booking interface.
4. The backend receives and validates the submitted information.
5. SQLite stores the appointment data.
6. The booking logic checks for scheduling conflicts to help avoid double-booking.
7. Google Calendar integration supports appointment scheduling where configured.

## Installation and Setup

To run the project locally, you will need Node.js and npm installed.

### 1. Clone the repository

```bash
git clone https://github.com/sbonga66/Gentlemens-Cut.git
```

### 2. Navigate to the project folder

```bash
cd Gentlemens-Cut
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

If the project uses environment variables for database configuration, API credentials, or other settings, create a `.env` file based on the variables required by the application.

Do not commit passwords, API secrets, private credentials, or other sensitive configuration to GitHub.

### 5. Start the application

```bash
npm start
```

Open the local address shown in the terminal to access the website. The default address for many Express applications is `http://localhost:3000`, but the actual port depends on the project configuration.

## Skills Demonstrated

This project demonstrates practical experience in:

- Frontend web development using HTML, CSS, and JavaScript.
- Backend development using Node.js and Express.js.
- Relational data storage using SQLite.
- Form handling and input validation.
- Appointment scheduling and conflict checking.
- API and external service integration.
- Debugging and resolving software development issues.
- Version control using Git and GitHub.
- Deploying a web application to a hosting platform.

## Future Improvements

Potential improvements include:

- A secure administrator dashboard for managing appointments.
- Customer booking confirmation emails and reminders.
- Improved appointment management and cancellation functionality.
- Automated testing for booking workflows.
- Enhanced accessibility and cross-browser testing.
- Better monitoring and error handling for production deployments.

## Author

**Sbongakonke Aphiwe Shandu**

Bachelor of Information and Communications Technology in Internet of Things (IoT) at the Durban University of Technology.

- **Live Project:** https://gentlemens-cut.onrender.com/

---

*This project was developed for educational and portfolio purposes to demonstrate practical full-stack web development skills.*
