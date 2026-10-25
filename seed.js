// Run: npm run seed   -> creates a demo recruiter, student and a few jobs
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({ email: /@demo\.com$/ }), Job.deleteMany({})]);
  const rec = await User.create({ name: 'Priya Recruiter', email: 'recruiter@demo.com', password: 'demo123', role: 'recruiter', company: 'Nimbus Labs' });
  await User.create({ name: 'Arjun Student', email: 'student@demo.com', password: 'demo123', role: 'student', university: 'RVCE Bengaluru', skills: ['React', 'Node.js'] });
  const d = (n) => new Date(Date.now() + n * 864e5);
  await Job.insertMany([
    { title: 'Frontend Intern', type: 'Internship', mode: 'Hybrid', location: 'Bengaluru', salary: '₹25,000/month', skills: ['React', 'CSS'], deadline: d(20), description: 'Build UI components for our analytics product with a mentor from the frontend team.' },
    { title: 'Backend Developer (Fresher)', type: 'Full-time', mode: 'On-site', location: 'Hyderabad', salary: '₹6–8 LPA', skills: ['Node.js', 'MongoDB'], deadline: d(30), description: 'Design REST APIs and own services end to end. Freshers with strong projects welcome.' },
    { title: 'Data Analyst Intern', type: 'Internship', mode: 'Remote', location: 'Remote', salary: '₹15,000/month', skills: ['SQL', 'Python'], deadline: d(15), description: 'Clean data, build dashboards and present weekly insights to the product team.' },
  ].map((j) => ({ ...j, recruiter: rec._id, company: 'Nimbus Labs' })));
  console.log('Seeded. Logins: recruiter@demo.com / student@demo.com  (password demo123)');
  process.exit();
})();
