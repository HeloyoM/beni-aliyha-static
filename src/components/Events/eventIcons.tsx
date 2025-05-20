import { JSX } from "react";
import { Baby, Heart, Home as HomeIcon, Cake, Briefcase, Star, GraduationCap, Gem, CalendarHeart } from 'lucide-react';

export const eventIcons: Record<string, JSX.Element> = {
  'baby-boy': <Baby />,
  'baby-girl': <Baby />,
  'wedding': <Gem />,
  'engagement': <Heart />,
  'new-job': <Briefcase />,
  'housewarming': <HomeIcon />,
  'birthday': <Cake />,
  'anniversary': <CalendarHeart />,
  'graduation': <GraduationCap />,
  'bar-mitzvah': <Star />,
};