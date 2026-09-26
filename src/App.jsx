import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';

function LoginProgress() {
  const { currentUser, logout } = useApp();

  const handleSignOut = () => {
    logout();
  };

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <main className="login-root grid min-h-screen place-items-center p-6">
      <section className="login-card w-full max-w-[440px] p-8 text-left">
        <h1 className="login-title">Welcome, {currentUser.name}</h1>
        <p className="login-subtitle">Your sign-in is working. Assignment dashboards will be added in the next project steps.</p>
        <button className="btn-logout mt-6" type="button" onClick={handleSignOut}>Sign out</button>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <AppProvider>
      <LoginProgress />
    </AppProvider>
  );
}