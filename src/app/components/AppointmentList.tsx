import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Clock, User, Stethoscope, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Appointment {
  id: number;
  patientName: string;
  phone: string;
  email?: string;
  specialty: string;
  doctor?: string;
  date: string;
  time: string;
  symptoms?: string;
  status: string;
}

const formatDate = (dateString: string) => {
  try {
    // Try to parse as ISO date (yyyy-MM-dd)
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy', { locale: vi });
  } catch {
    // If parsing fails, return as is (might already be formatted)
    return dateString;
  }
};

interface AppointmentListProps {
  appointments: Appointment[];
  onDeleteAppointment: (id: number) => void;
}

export function AppointmentList({ appointments, onDeleteAppointment }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="mb-2 text-gray-600">Chưa có lịch khám</h3>
          <p className="text-sm text-gray-500">
            Các lịch hẹn của bạn sẽ hiển thị ở đây
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh Sách Lịch Khám</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{appointment.status}</Badge>
                  <Badge variant="outline">{appointment.specialty}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteAppointment(appointment.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{appointment.patientName}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">📱</span>
                  <span>{appointment.phone}</span>
                </div>

                {appointment.email && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">📧</span>
                    <span>{appointment.email}</span>
                  </div>
                )}

                {appointment.doctor && (
                  <div className="flex items-center space-x-2">
                    <Stethoscope className="w-4 h-4 text-gray-500" />
                    <span>{appointment.doctor}</span>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{formatDate(appointment.date)}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              {appointment.symptoms && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Triệu chứng: </span>
                    {appointment.symptoms}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
