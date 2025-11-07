import { Pet } from 'src/pet/entities/pet.entity';

export class User {
  id: number;
  email: string;
  name: string;
  password: string;
  location: string;
  createdAt: Date;
  pets: Pet[];
}
