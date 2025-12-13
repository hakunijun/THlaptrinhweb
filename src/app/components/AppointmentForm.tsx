import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Appointment } from '../services/api';

interface AppointmentFormData {
  patientName: string;
  phone: string;
  email?: string;
  specialty: string;
  doctor?: string;
  symptoms?: string;
}

interface AppointmentFormProps {
  onAppointmentBooked: (appointment: Appointment) => void;
}

const specialties = [
  'Tim Mạch',
  'Thần Kinh',
  'Ngoại Tổng Hợp',
  'Sản Phụ Khoa',
  'Nhi Khoa',
  'Ung Bướu',
  'Da Liễu',
  'Mắt',
  'Tai Mũi Họng',
  'Răng Hàm Mặt'
];

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'
];

export function AppointmentForm({ onAppointmentBooked }: AppointmentFormProps) {
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<AppointmentFormData>({
    defaultValues: {
      specialty: ''
    },
    mode: 'onChange'
  });

  const selectedSpecialty = watch('specialty');

  const onSubmit = (data: AppointmentFormData) => {
    if (!date) {
      toast.error('Vui lòng chọn ngày khám');
      return;
    }
    if (!selectedTime) {
      toast.error('Vui lòng chọn giờ khám');
      return;
    }
    if (!data.specialty || data.specialty.trim() === '') {
      toast.error('Vui lòng chọn chuyên khoa');
      return;
    }

    const appointment: Appointment = {
      id: 0, // Will be set by backend
      userId: 0, // Will be set by parent component
      patientName: data.patientName,
      phone: data.phone,
      email: data.email || undefined,
      specialty: data.specialty,
      doctor: data.doctor || undefined,
      date: format(date, 'yyyy-MM-dd'), // Use ISO format for database
      time: selectedTime,
      symptoms: data.symptoms || undefined,
      status: 'pending'
    };

    onAppointmentBooked(appointment);
    
    // Reset form
    reset();
    setDate(undefined);
    setSelectedTime('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đặt Lịch Khám</CardTitle>
        <CardDescription>
          Vui lòng điền đầy đủ thông tin để đặt lịch khám. Chúng tôi sẽ liên hệ xác nhận trong vòng 24h.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName">Họ và tên bệnh nhân *</Label>
              <Input
                id="patientName"
                {...register('patientName', { required: 'Vui lòng nhập họ tên' })}
                placeholder="Nguyễn Văn A"
              />
              {errors.patientName && (
                <p className="text-sm text-red-600 mt-1">{errors.patientName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  {...register('phone', { 
                    required: 'Vui lòng nhập số điện thoại',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Số điện thoại không hợp lệ'
                    }
                  })}
                  placeholder="0912345678"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="specialty">Chuyên khoa *</Label>
              <Select 
                onValueChange={(value) => {
                  setValue('specialty', value, { shouldValidate: true });
                }}
                value={selectedSpecialty || ''}
              >
                <SelectTrigger className={errors.specialty ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Chọn chuyên khoa" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register('specialty', { required: 'Vui lòng chọn chuyên khoa' })}
              />
              {errors.specialty && (
                <p className="text-sm text-red-600 mt-1">{errors.specialty.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="doctor">Bác sĩ chỉ định (tùy chọn)</Label>
              <Input
                id="doctor"
                {...register('doctor')}
                placeholder="Nhập tên bác sĩ nếu có"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Ngày khám *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'dd/MM/yyyy', { locale: vi }) : 'Chọn ngày'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Giờ khám *</Label>
                <Select onValueChange={setSelectedTime} value={selectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giờ khám">
                      {selectedTime && (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {selectedTime}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <Label htmlFor="symptoms">Triệu chứng / Lý do khám</Label>
            <Textarea
              id="symptoms"
              {...register('symptoms')}
              placeholder="Mô tả triệu chứng hoặc lý do cần khám..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            Đặt Lịch Khám
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
