
import Footer from '../component/footer';
import Header from '../component/header';
import Chat from '../component/Chat';
import teamMember1 from '../assets/1.jpg';
import teamMember2 from '../assets/1.jpg';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Abdul Majeed',
      role: 'Team Lead and Frontend Programmer',
      image: teamMember1,
    },
    {
      name: 'G Manjunathan',
      role: 'Backend Programmer',
      image: teamMember2,
    },
    {
      name: 'Koh Juin Hao, Joseph',
      role: 'Documentation Head',
      image: teamMember2,
    },
    {
      name: 'Richard Ricardo Wijaya',
      role: 'Documentation Head',
      image: teamMember2,
    },
    {
      name: 'Steven Ni Bowen',
      role: 'Backend Programmer',
      image: teamMember2,
    },
  ];

  return (
    <>
      <Header />
      <main style={{ flex: '1', padding: '20px' }}>
        {/* About Section */}
        <section className="about-section">
          <h1>About Us</h1>
          <p>
            Welcome to our Tourist Guide Chatbot! We’re here to make your journey through Singapore seamless, informative, and enjoyable.
            We are a team of 5 developers working together to create an efficient chatbot to assist you in your travel planning.
          </p>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
            To provide a comprehensive and personalized travel experience for tourists exploring Singapore.
            We aim to combine the best of technology and local knowledge to ensure visitors have a memorable stay.
          </p>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Meet the Team</h2>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-member">
                <img src={member.image} alt={`Image of ${member.name}`} />
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <h2>Contact Us</h2>
          <p>For any inquiries, feel free to reach out to us:</p>
          <p>Email: <a href="mailto:info@touristguidechatbot.com">info@touristguidechatbot.com</a></p>
          <p>Phone: +65 1234 5678</p>
        </section>
      </main>
      <Chat />
      <Footer />
    </>
  );
};

export default About;
