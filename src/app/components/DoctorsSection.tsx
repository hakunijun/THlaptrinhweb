import { DoctorCard } from './DoctorCard';

const doctors = [
  {
    id: 1,
    name: 'PGS.TS.BS Nguyễn Văn An',
    title: 'Giám Đốc Bệnh Viện - Trưởng Khoa Tim Mạch',
    specialty: 'Tim Mạch Can Thiệp',
    education: 'Tiến sĩ Y khoa - Đại học Y Hà Nội, Chuyên khoa Tim Mạch - Đại học Harvard, Mỹ',
    experience: 'Hơn 25 năm kinh nghiệm trong lĩnh vực tim mạch can thiệp',
    achievements: [
      'Thực hiện hơn 5000 ca can thiệp tim mạch thành công',
      'Giải thưởng Thầy thuốc Ưu tú Thành phố năm 2018',
      'Hơn 50 công trình nghiên cứu quốc tế được công bố'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1632054224659-280be3239aff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NTU5MTg4Nnww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 2,
    name: 'TS.BS Trần Thị Bích Ngọc',
    title: 'Phó Giám Đốc - Trưởng Khoa Thần Kinh',
    specialty: 'Thần Kinh',
    education: 'Tiến sĩ Y khoa - Đại học Y Dược TP.HCM, Chuyên khoa Thần Kinh - Đại học Tokyo, Nhật Bản',
    experience: 'Hơn 20 năm kinh nghiệm điều trị bệnh lý thần kinh',
    achievements: [
      'Chuyên gia hàng đầu về đột quỵ não tại Việt Nam',
      'Huân chương Lao động hạng Ba năm 2020',
      'Tác giả của 3 cuốn sách chuyên ngành thần kinh'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1632054226752-b1b40867f7a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY1NTI3OTczfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 3,
    name: 'PGS.TS.BS Lê Minh Tuấn',
    title: 'Trưởng Khoa Ngoại Tổng Hợp',
    specialty: 'Ngoại Khoa',
    education: 'Tiến sĩ Y khoa - Đại học Y Hà Nội, Chuyên khoa Ngoại - Johns Hopkins, Mỹ',
    experience: 'Hơn 22 năm kinh nghiệm phẫu thuật ngoại khoa',
    achievements: [
      'Thực hiện thành công hơn 3000 ca phẫu thuật phức tạp',
      'Chuyên gia về phẫu thuật nội soi và robot',
      'Giảng viên thỉnh giảng tại nhiều trường đại học'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1758691462482-2b6ccbaefa6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBkb2N0b3IlMjBwaHlzaWNpYW58ZW58MXx8fHwxNzY1NjI5MTY2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 4,
    name: 'TS.BS Phạm Thị Hương',
    title: 'Trưởng Khoa Sản Phụ Khoa',
    specialty: 'Sản Phụ Khoa',
    education: 'Tiến sĩ Y khoa - Đại học Y Dược TP.HCM, Chuyên khoa Sản - Seoul National University, Hàn Quốc',
    experience: 'Hơn 18 năm kinh nghiệm trong lĩnh vực sản phụ khoa',
    achievements: [
      'Chuyên gia về sinh con và chăm sóc thai sản',
      'Đỡ đẻ và mổ đẻ an toàn cho hơn 8000 ca',
      'Giải thưởng Thầy thuốc Nhân dân năm 2021'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1576669802218-d535933f897c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGRvY3RvciUyMG1lZGljYWx8ZW58MXx8fHwxNzY1NTI1MTYzfDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function DoctorsSection() {
  return (
    <div className="space-y-6">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="mb-4">Đội Ngũ Lãnh Đạo & Chuyên Gia</h2>
        <p className="text-gray-600">
          Đội ngũ bác sĩ chuyên gia hàng đầu với trình độ chuyên môn cao, được đào tạo tại các 
          trường đại học danh tiếng trong và ngoài nước, luôn tận tâm phục vụ bệnh nhân.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} {...doctor} />
        ))}
      </div>
    </div>
  );
}
