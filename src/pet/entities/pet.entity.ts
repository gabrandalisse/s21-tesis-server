export class Pet {
  id: number;
  ownerId: number;
  name: string;
  typeId: number;
  breedId: number;
  // TODO tipify color
  colorId: number;
  sizeId: number;
  // TODO tipify sex
  sexId: number;
  age: number;
  photoUrl: string;
  distinctiveCharacteristics: string | undefined;
  createdAt: Date;
  reports: any[];
}
