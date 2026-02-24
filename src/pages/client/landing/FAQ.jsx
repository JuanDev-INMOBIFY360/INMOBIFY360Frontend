import React from 'react';
import './FAQ.css';

const faqs = [
  {
    question: '¿Cómo puedo buscar una propiedad?',
    answer:
      'Utiliza la barra de búsqueda en la parte superior para filtrar por ciudad, tipo de propiedad y más.',
  },
  {
    question: '¿Necesito registrarme para ver los detalles?',
    answer:
      'Puedes explorar libremente todas las propiedades sin necesidad de registrarte.',
  },
  {
    question: '¿Cómo programo una visita?',
    answer:
      'Haz clic en "Ver más" en la propiedad de tu interés y luego en la parte inferior en la parte derecha debes de dar clic en "Contactar con un Asesor". Seras redirigido al chat de WhatsApp para que puedas comunicarte con uno de nuestros asesores.',
  },
];

const FAQ = () => {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <h2>Preguntas Frecuentes</h2>
        {faqs.map((item, idx) => (
          <div key={idx} className="faq-item">
            <h3>{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
