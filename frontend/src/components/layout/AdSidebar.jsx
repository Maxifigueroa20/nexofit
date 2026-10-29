import React from 'react';
import Icon from '../common/Icon';

export default function AdSidebar() {
  const ads = [
    {
      id: 'ad-1',
      title: 'NutriSport Jujuy',
      desc: 'Proteínas y creatinas con entrega inmediata en San Salvador y Palpalá.',
      icon: 'lightning-charge-fill',
      iconBg: 'bg-warning text-dark'
    },
    {
      id: 'ad-2',
      title: 'FitWear Jujuy Indumentaria',
      desc: 'Remeras técnicas y calzado para entrenamiento funcional y running.',
      icon: 'bag-check-fill',
      iconBg: 'bg-primary text-white'
    },
    {
      id: 'ad-3',
      title: 'ElectroMax Hidratación',
      desc: 'Bebidas isotónicas en polvo sin azúcar para tus sesiones intensas.',
      icon: 'droplet-fill',
      iconBg: 'bg-info text-dark'
    }
  ];

  return (
    <aside className="app-sidebar app-sidebar-ads">
      <div className="sidebar-group p-2">
        <div className="d-flex align-items-center pb-1 mb-2 border-bottom">
          <span className="fw-bold text-muted" style={{ fontSize: '10px' }}>PUBLICIDAD</span>
        </div>

        <div className="d-flex flex-column gap-3">
          {ads.map((ad) => (
            <div key={ad.id} className="d-flex gap-2">
              <div
                className={`d-flex align-items-center justify-content-center flex-shrink-0 rounded-1 ${ad.iconBg}`}
                style={{ width: '40px', height: '40px' }}
              >
                <Icon name={ad.icon} className="fs-5" />
              </div>
              <div className="flex-grow-1" style={{ fontSize: '10px', lineHeight: '1.3' }}>
                <a href="#" className="fb-link d-block" onClick={(e) => e.preventDefault()}>
                  {ad.title}
                </a>
                <span className="text-secondary">{ad.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
