export type Item = {
  id: string;
  type: 'lost' | 'found';
  name:string;
  category: string;
  description: string;
  distinguishingMarks?: string;
  location: string;
  date: Date;
  imageUrl: string;
  contact: string;
  lat: number;
  lng: number;
};
