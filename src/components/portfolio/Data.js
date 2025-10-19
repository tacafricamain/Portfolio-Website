export const projectsData = [
  // ...existing projects...
  {
    id: Date.now() + 1, // Ensure unique ID
    image: "/assets/medic-dashboard.png", // Add screenshot of your dashboard
    title: "Medical Dashboard System",
    description: "A comprehensive hospital management dashboard featuring patient tracking, appointment scheduling, staff management, and real-time analytics. Built with modern web technologies for healthcare professionals.",
    category: "web",
    technologies: ["React", "JavaScript", "CSS3", "Dashboard UI", "Healthcare Analytics"],
    demoLink: "https://medic-0.vercel.app/dashboard",
    codeLink: "https://github.com/yourusername/medical-dashboard", // Update with actual GitHub repo
    features: [
      "Patient management system",
      "Appointment scheduling",
      "Real-time analytics dashboard",
      "Staff management interface",
      "Responsive healthcare UI",
      "Revenue tracking"
    ]
  },
  {
    id: Date.now(), 
    image: "/assets/brahamas-tour.png",
    title: "Brahamas Tour Website",
    description: "A professional travel booking website for Brahamas tours featuring destination showcases, customer reviews, and booking functionality. Built with modern web technologies and responsive design.",
    category: "web",
    technologies: ["React", "CSS3", "JavaScript", "Responsive Design"],
    demoLink: "https://brahamas-tour.vercel.app/",
    codeLink: "https://github.com/yourusername/brahamas-tour", // Update with actual GitHub repo
    features: [
      "Responsive travel booking interface",
      "Customer testimonials system",
      "Destination showcase",
      "Contact integration",
      "Modern UI/UX design"
    ]
  }
  // ...existing projects...
];

export const projectsNav = [
  {
    name: 'all',
  },
  {
    name: 'web',
  },
  {
    name: 'app',
  },
  {
    name: 'design',
  },
];
