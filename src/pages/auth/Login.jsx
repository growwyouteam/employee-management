import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../../api/auth';
import useAuthStore from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Lock, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'rajesh.kumar@company.com',
      password: 'password123',
    },
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      }
    },
    onError: (error) => {
      setError(error.message || 'Login failed. Please try again.');
    },
  });

  const onSubmit = (data) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">
            Employee MS
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Demo Credentials */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Admin:</strong> sunita.kapoor@company.com</p>
            <p><strong>HR:</strong> priya.sharma@company.com</p>
            <p><strong>Manager:</strong> vikram.singh@company.com</p>
            <p><strong>Employee:</strong> rajesh.kumar@company.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register('email')}
                className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                {...register('password')}
                className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loginMutation.isPending}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
            Contact HR
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
