import React from 'react';
import { Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { RiWhatsappLine, RiTiktokLine } from 'react-icons/ri';
import './Footer.css';

const Footer = () => {
  // Números y correos aleatorios (se pueden cambiar luego)
  const contactInfo = {
    phone: '+57 314 8395860',
    email: 'contacto@inmobify360.com',
  };

  const socialLinks = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: RiWhatsappLine,
      url: 'https://wa.me/573148395860',
      color: '#25D366',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com',
      color: '#1877F2',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: '#E4405F',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      icon: RiTiktokLine,
      url: 'https://tiktok.com',
      color: '#ffffff',
    },
  ];

  return (
    <footer className="landing-footer">
      <div className="footer-content">
        {/* Sección de contacto */}
        <div className="footer-section footer-contact">
          <h3 className="footer-title">Contacto</h3>
          <div className="contact-items">
            <a href={`tel:${contactInfo.phone}`} className="contact-item">
              <Phone size={18} />
              <span>{contactInfo.phone}</span>
            </a>
            <a href={`mailto:${contactInfo.email}`} className="contact-item">
              <Mail size={18} />
              <span>{contactInfo.email}</span>
            </a>
          </div>
        </div>

        {/* Sección de redes sociales */}
        <div className="footer-social">
          <h3 className="footer-title">Síguenos</h3>
          <div className="social-links">
            
            {socialLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  style={{ '--social-color': link.color }}
                  title={link.label}
                  aria-label={link.label}
                >
                  <IconComponent size={24} />
                </a>
              );
            })}
          </div>
        </div>

         
   
      </div>
                <p className="footer-copyright">© {new Date().getFullYear()} Inmobify360. Todos los derechos reservados.</p>

    </footer>
  );
};

export default Footer;
