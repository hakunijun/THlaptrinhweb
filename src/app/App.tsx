import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { HospitalIntro } from './components/HospitalIntro';
import { DoctorsSection } from './components/DoctorsSection';
import { AppointmentForm } from './components/AppointmentForm';
import { AppointmentList } from './components/AppointmentList';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { UserProfile } from './components/UserProfile';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Toaster } from './components/ui/sonner';
import { Hospital, Users, Calendar, List, User as UserIcon, LogIn } from 'lucide-react';
import { Button } from './components/ui/button';
import { appointmentsAPI, Appointment } from './services/api';
import { toast } from 'sonner';

function AppContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Fetch appointments when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadAppointments();
    } else {
      setAppointments([]);
    }
  }, [isAuthenticated, user]);

  const loadAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await appointmentsAPI.getAppointments(user.id);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Không thể tải danh sách lịch khám');
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentBooked = async (appointment: Appointment) => {
    if (!user) return;
    
    try {
      const newAppointment = await appointmentsAPI.createAppointment({
        userId: parseInt(user.id),
        patientName: appointment.patientName,
        phone: appointment.phone,
        email: appointment.email,
        specialty: appointment.specialty,
        doctor: appointment.doctor,
        date: appointment.date,
        time: appointment.time,
        symptoms: appointment.symptoms,
      });
      setAppointments([...appointments, newAppointment]);
      toast.success('Đặt lịch khám thành công!');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Không thể đặt lịch khám. Vui lòng thử lại.');
    }
  };

  const handleDeleteAppointment = async (id: number) => {
    try {
      await appointmentsAPI.deleteAppointment(id);
      setAppointments(appointments.filter(apt => apt.id !== id));
      toast.success('Đã xóa lịch khám');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Không thể xóa lịch khám. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Hospital className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl">Bệnh Viện Đa Khoa Quốc Tế</h1>
                <p className="text-sm text-gray-600">Chăm sóc sức khỏe toàn diện</p>
              </div>
            </div>
            
            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline">
                  Xin chào, <span className="font-medium text-gray-900">{user.fullName}</span>
                </span>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setAuthView('login')}>
                <LogIn className="w-4 h-4 mr-2" />
                Đăng Nhập
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isAuthenticated ? (
          <div className="py-12">
            {authView === 'login' ? (
              <LoginForm onSwitchToRegister={() => setAuthView('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
            )}
          </div>
        ) : (
          <Tabs defaultValue="hospital" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-[700px] lg:mx-auto">
              <TabsTrigger value="hospital" className="flex items-center space-x-2">
                <Hospital className="w-4 h-4" />
                <span className="hidden sm:inline">Giới Thiệu</span>
              </TabsTrigger>
              <TabsTrigger value="doctors" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Đội Ngũ</span>
              </TabsTrigger>
              <TabsTrigger value="booking" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Đặt Lịch</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Lịch Khám
                  {appointments.length > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-600 text-white rounded-full">
                      {appointments.length}
                    </span>
                  )}
                </span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Tài Khoản</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="hospital">
              <HospitalIntro />
            </TabsContent>

            <TabsContent value="doctors">
              <DoctorsSection />
            </TabsContent>

            <TabsContent value="booking">
              <div className="max-w-3xl mx-auto">
                <AppointmentForm onAppointmentBooked={handleAppointmentBooked} />
              </div>
            </TabsContent>

            <TabsContent value="appointments">
              <div className="max-w-4xl mx-auto">
                <AppointmentList 
                  appointments={appointments} 
                  onDeleteAppointment={handleDeleteAppointment}
                />
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <UserProfile />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="mb-4">Liên Hệ</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📍 Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                <p>📞 Hotline: 1900-1234</p>
                <p>📧 Email: info@benhvien.vn</p>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4">Giờ Làm Việc</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Thứ 2 - Thứ 6: 07:00 - 17:00</p>
                <p>Thứ 7: 07:00 - 12:00</p>
                <p>Chủ nhật: Chỉ cấp cứu</p>
                <p className="text-red-600 font-medium">Cấp cứu 24/7</p>
              </div>
            </div>
            
            <div>
              <h3 className="mb-4">Dịch Vụ</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Khám chữa bệnh</p>
                <p>• Xét nghiệm</p>
                <p>• Chẩn đoán hình ảnh</p>
                <p>• Phẫu thuật</p>
                <p>• Điều trị nội trú</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
            <p>&copy; 2024 Bệnh Viện Đa Khoa Quốc Tế Việt Nam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}