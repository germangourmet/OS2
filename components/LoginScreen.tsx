
import React, { useState } from 'react';
import logoUrl from '../logo.png?url';
import bgUrl from '../bg-login.png?url';
import geminiUrl from '../Gemini_Generated_Image_93s6sr93s6sr93s6.png?url';
import type { FSNode, FileNode, SessionInfo } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (username: SessionInfo['username']) => void;
  fs: FSNode;
}

const translations = {
  en: {
    brand: 'AI Recruitment',
    title: 'Talent Acquisition Platform 1.0',
    usernameLabel: 'Username',
    passwordLabel: 'Password',
    rememberMe: 'Remember me',
    signInButton: 'Sign In',
    signingInButton: 'Signing in...',
    forgotPassword: 'Forgot Password?',
    errorInvalid: 'Invalid username or password.',
    errorSystem: 'A system error occurred. Please try again.'
  },
  es: {
    brand: 'Reclutamiento IA',
    title: 'Plataforma de Adquisición de Talento 1.0',
    usernameLabel: 'Usuario',
    passwordLabel: 'Contraseña',
    rememberMe: 'Recuérdame',
    signInButton: 'Iniciar Sesión',
    signingInButton: 'Iniciando sesión...',
    forgotPassword: '¿Olvidó su contraseña?',
    errorInvalid: 'Usuario o contraseña inválidos.',
    errorSystem: 'Ocurrió un error en el sistema. Por favor, inténtelo de nuevo.'
  }
};


const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, fs }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorKey, setErrorKey] = useState<'invalid' | 'system' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorKey(null);

    // Simulate network delay for better UX
    setTimeout(() => {
      try {
        if (fs.type !== 'directory') throw new Error("Root filesystem is not a directory.");
        
        const systemDir = fs.children.find(c => c.name === 'system' && c.type === 'directory');
        if (!systemDir || systemDir.type !== 'directory') throw new Error("System directory not found in filesystem.");
        
        const usersFile = systemDir.children.find(f => f.name === 'users.json' && f.type === 'file') as FileNode | undefined;
        if (!usersFile) throw new Error("User database file (users.json) not found.");

        const users = JSON.parse(usersFile.content);
        const user = users.find((u: any) => u.username.toLowerCase() === username.toLowerCase());

        if (user && user.password === password) {
          onLoginSuccess(user.username);
        } else {
          setErrorKey('invalid');
        }
      } catch (err: any) {
        console.error("Login error:", err);
        setErrorKey('system');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };
  
  const errorMessages = {
      invalid: translations[language].errorInvalid,
      system: translations[language].errorSystem,
  };

  // Add CSS for spinning animation
  const spinningStyles = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spin-image {
      animation: spin 8s linear infinite;
    }
  `;

  return (
    <>
      <style>{spinningStyles}</style>
      <div 
        className="absolute inset-0 flex items-center justify-center z-[100]"
        style={{
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/20 z-0" />
        
        {/* Spinning Gemini background during login */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
            <img 
              src={geminiUrl} 
              alt="Loading" 
              className="spin-image w-96 h-96 object-cover rounded-full shadow-2xl opacity-60"
            />
          </div>
        )}
        
        <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Language selector */}
        <div className="flex justify-center gap-2 mb-6">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-4 py-1 text-sm font-medium rounded-full transition-all ${
              language === 'en' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            English
          </button>
          <button 
            onClick={() => setLanguage('es')}
            className={`px-4 py-1 text-sm font-medium rounded-full transition-all ${
              language === 'es' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Español
          </button>
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={logoUrl} alt="Logo" className="h-12" />
        </div>

        {/* Stylish title - removed brand text */}
        <h1 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 mb-2">
          Management System
        </h1>
        <p className="text-center text-gray-500 text-sm mb-8 font-semibold tracking-wide">
          0.5 BETA
        </p>

        {/* Login form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-800 mb-2">
              {translations[language].usernameLabel}
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              {translations[language].passwordLabel}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              required
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-gray-600 select-none cursor-pointer">
              {translations[language].rememberMe}
            </label>
          </div>

          {/* Error message */}
          {errorKey && (
            <p className="text-red-600 text-sm text-center font-medium bg-red-50 rounded-lg p-2">
              {errorMessages[errorKey]}
            </p>
          )}

          {/* Sign in button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isLoading ? translations[language].signingInButton : translations[language].signInButton}
          </button>

          {/* Forgot password link */}
          <div className="text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              {translations[language].forgotPassword}
            </a>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default LoginScreen;
