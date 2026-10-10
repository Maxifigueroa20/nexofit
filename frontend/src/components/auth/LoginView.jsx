import React, { useState } from 'react';
import Icon from '../common/Icon';

export default function LoginView({ onLoginSuccess }) {
  const [username, setUsername] = useState('carlos_titan');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      onLoginSuccess(data.user, data.institution);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (user) => {
    setUsername(user.username);
    setPassword(user.hintPassword);
    setLoading(true);
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, password: user.hintPassword })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        onLoginSuccess(data.user, data.institution);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const ownerAccounts = [
    { username: 'carlos_titan', label: 'Gimnasio', name: 'Carlos Méndez', icon: 'building' },
    { username: 'marcela_pilates', label: 'Pilates', name: 'Marcela Rossi', icon: 'heart-pulse' },
    { username: 'esteban_yoga', label: 'Yoga', name: 'Esteban Varela', icon: 'sun' }
  ];

  const clientAccounts = [
    { username: 'mariano_cliente', label: 'Cliente', name: 'Mariano López', icon: 'person' },
    { username: 'valeria_cliente', label: 'Cliente', name: 'Valeria Montes', icon: 'person' },
    { username: 'lucas_cliente', label: 'Cliente', name: 'Lucas Herrera', icon: 'person' }
  ];

  return (
    <div className="login-page">
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="aero-window">
          <div className="row g-0 justify-content-center">
            <div className="col-12 col-md-5 bg-white d-flex flex-column border-end">
              <header className="aero-window-top">
                <div className="d-flex align-items-center gap-2">
                  <div className="aero-brand-icon">
                    <Icon name="link-45deg" />
                  </div>
                  <div>
                    <h1 className="aero-brand-title">NexoFit</h1>
                    <p className="aero-brand-subtitle">Portal de Acceso</p>
                  </div>
                </div>
              </header>

            <div className="p-4 flex-grow-1 d-flex flex-column justify-content-center">
              {error && (
                <div className="alert alert-danger p-2 mb-3 small">
                  <Icon name="exclamation-triangle-fill" className="me-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label small fw-bold mb-1">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control form-control-sm"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. carlos_titan"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    required
                    className="form-control form-control-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 btn-sm"
                    disabled={loading}
                  >
                    <Icon name="box-arrow-in-right" className="me-1" />
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="col-12 col-md-7 bg-white p-4 d-flex flex-column justify-content-center">
            <div className="mb-3">
              <div className="small fw-bold text-primary text-uppercase mb-2">
                Cuentas Dueño
              </div>
              <div className="row g-2">
                {ownerAccounts.map((item) => (
                  <div key={item.username} className="col-4">
                    <button
                      type="button"
                      className="btn btn-light w-100 p-2 text-center border h-100 d-flex flex-column align-items-center justify-content-center demo-tile"
                      onClick={() => handleQuickLogin({ username: item.username, hintPassword: 'password123' })}
                      title={`Ingresar como ${item.name}`}
                    >
                      <Icon name={item.icon} className="text-primary mb-1 fs-5" />
                      <div className="fw-bold small text-truncate w-100">{item.label}</div>
                      <div className="text-muted text-truncate w-100 small">{item.name}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="small fw-bold text-success text-uppercase mb-2">
                Cuentas Cliente
              </div>
              <div className="row g-2">
                {clientAccounts.map((item) => (
                  <div key={item.username} className="col-4">
                    <button
                      type="button"
                      className="btn btn-light w-100 p-2 text-center border h-100 d-flex flex-column align-items-center justify-content-center demo-tile"
                      onClick={() => handleQuickLogin({ username: item.username, hintPassword: 'password123' })}
                      title={`Ingresar como ${item.name}`}
                    >
                      <Icon name={item.icon} className="text-success mb-1 fs-5" />
                      <div className="fw-bold small text-truncate w-100">{item.label}</div>
                      <div className="text-muted text-truncate w-100 small">{item.name}</div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
