export interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export interface ContentDetailsProps {
  description: string;
  last_updated: Date;
}

export interface CourseHeaderProps {
  title: string;
  rating: number;
  totalRatings: number;
}