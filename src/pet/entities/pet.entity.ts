export class Pet {
  id: number;
  userId: number;
  name: string;
  typeId: number;
  breedId: number;
  colorId: number;
  sizeId: number;
  sexId: number;
  age: number;
  photoUrl: string;
  distinctiveCharacteristics: string | undefined;
  createdAt: Date;
  reports: any[];
}
