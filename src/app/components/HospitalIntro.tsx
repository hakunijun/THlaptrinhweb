import { Building2, Award, Users, Clock } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export function HospitalIntro() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
        <div className="relative z-10">
          <h1 className="mb-4">Bệnh Viện Đa Khoa Quốc Tế Việt Nam</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Với hơn 30 năm kinh nghiệm, chúng tôi tự hào là một trong những bệnh viện hàng đầu 
            tại Việt Nam, cung cấp dịch vụ y tế chất lượng cao với đội ngũ bác sĩ chuyên môn 
            và trang thiết bị hiện đại.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Building2 className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-600 mb-1">15+</div>
            <div className="text-sm text-gray-600">Khoa Chuyên Môn</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-600 mb-1">150+</div>
            <div className="text-sm text-gray-600">Bác Sĩ Chuyên Khoa</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-600 mb-1">50K+</div>
            <div className="text-sm text-gray-600">Bệnh Nhân/Năm</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Cấp Cứu</div>
          </CardContent>
        </Card>
      </div>

      {/* About Section */}
      <Card>
        <CardContent className="p-8">
          <h2 className="mb-4">Về Chúng Tôi</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              Bệnh Viện Đa Khoa Quốc Tế Việt Nam được thành lập năm 1993 với sứ mệnh 
              mang đến dịch vụ chăm sóc sức khỏe toàn diện và chất lượng cao cho cộng đồng. 
              Chúng tôi không ngừng đầu tư vào công nghệ y tế tiên tiến và phát triển đội ngũ 
              chuyên gia y tế hàng đầu.
            </p>
            <p>
              Với cơ sở vật chất hiện đại, trang thiết bị y tế tiên tiến nhập khẩu từ Mỹ, 
              Châu Âu và Nhật Bản, cùng đội ngũ y bác sĩ giàu kinh nghiệm được đào tạo trong 
              và ngoài nước, chúng tôi cam kết mang đến sự chăm sóc tốt nhất cho mỗi bệnh nhân.
            </p>
            <div className="pt-4">
              <h3 className="mb-3">Chuyên Khoa Nổi Bật</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Khoa Tim Mạch</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Khoa Thần Kinh</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Khoa Ngoại Tổng Hợp</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Khoa Sản Phụ Khoa</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Khoa Nhi</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span>Khoa Ung Bướu</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
