import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Bienvenido al panel administrativo. Aquí puedes gestionar propiedades, usuarios y ajustes.</p>
      <div style={{marginTop:16}}>
        <div style={{padding:16, borderRadius:8, background:'var(--color-bg)', border:'1px solid var(--color-border)'}}>
          <strong style={{color:'var(--color-text)'}}>Resumen</strong>
          <p style={{color:'var(--color-text-secondary)'}}>Propiedades: 123 · Usuarios: 45 · Mensajes: 8</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
