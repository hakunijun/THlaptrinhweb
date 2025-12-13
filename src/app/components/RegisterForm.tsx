import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    const success = await registerUser(data.email, data.password, data.fullName, data.phone);
    setIsLoading(false);

    if (success) {
      toast.success('Đăng ký thành công!');
    } else {
      toast.error('Email đã được sử dụng');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <CardTitle>Đăng Ký Tài Khoản</CardTitle>
        <CardDescription>
          Tạo tài khoản để quản lý lịch khám của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              {...register('fullName', {
                required: 'Vui lòng nhập họ tên',
                minLength: {
                  value: 2,
                  message: 'Họ tên phải có ít nhất 2 ký tự'
                }
              })}
              placeholder="Nguyễn Văn A"
            />
            {errors.fullName && (
              <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', {
                required: 'Vui lòng nhập email',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ'
                }
              })}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              {...register('phone', {
                required: 'Vui lòng nhập số điện thoại',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Số điện thoại không hợp lệ (10 chữ số)'
                }
              })}
              placeholder="0912345678"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Vui lòng nhập mật khẩu',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  }
                })}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Vui lòng xác nhận mật khẩu',
                  validate: value => value === password || 'Mật khẩu không khớp'
                })}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Đã có tài khoản? </span>
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Đăng nhập
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
