import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from './AuthContext';
import { User, Mail, Phone, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Thông Tin Tài Khoản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-blue-600" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Họ và tên</p>
              <p className="font-medium">{user.fullName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Số điện thoại</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          </div>
        </div>

        <Button
          variant="destructive"
          className="w-full mt-6"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Đăng Xuất
        </Button>
      </CardContent>
    </Card>
  );
}
