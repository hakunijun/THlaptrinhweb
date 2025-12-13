import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Award, GraduationCap, Star } from 'lucide-react';

interface DoctorCardProps {
  name: string;
  title: string;
  specialty: string;
  education: string;
  experience: string;
  achievements: string[];
  imageUrl: string;
}

export function DoctorCard({ 
  name, 
  title, 
  specialty, 
  education, 
  experience, 
  achievements,
  imageUrl 
}: DoctorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="mb-1">{name}</h3>
          <p className="text-blue-600">{title}</p>
        </div>
        
        <Badge variant="secondary" className="mb-4">{specialty}</Badge>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <GraduationCap className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{education}</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{experience}</span>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-start space-x-2 mb-2">
              <Award className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">Thành tựu nổi bật:</span>
            </div>
            <ul className="space-y-1 ml-6">
              {achievements.map((achievement, index) => (
                <li key={index} className="text-gray-600 text-xs list-disc">
                  {achievement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
