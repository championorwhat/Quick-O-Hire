import  { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

interface AuthPageProps {
  onLogin: (userData: { name: string; email: string; password?: string }) => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(formData);
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
    // Reset form when toggling
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <motion.div 
        className="card w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="gradient-bg px-8 py-6 text-white">
          <motion.h1 
            className="text-2xl font-bold text-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </motion.h1>
          <p className="text-center mt-2 text-indigo-100">
            {isLogin 
              ? 'Sign in to continue to your account' 
              : 'Sign up to start your journey'}
          </p>
          <div className="mt-3 text-xs text-center text-indigo-200">
            <p>Try logging in with an email containing "admin" to access the admin dashboard</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-sm text-primary-600 hover:text-primary-800">
                  Forgot password?
                </a>
              </div>
            )}
            
            <motion.button
              type="submit"
              className="btn-primary w-full mt-6 flex items-center justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLogin ? (
                <>
                  <LogIn size={18} className="mr-2" />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={18} className="mr-2" />
                  Sign Up
                </>
              )}
            </motion.button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={toggleView}
                className="ml-1 text-primary-600 hover:text-primary-800 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
 