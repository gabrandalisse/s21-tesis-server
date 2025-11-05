import { Injectable } from '@nestjs/common';
import { CreatePetDto } from '../dto/create-pet.dto';
import { UpdatePetDto } from '../dto/update-pet.dto';

@Injectable()
export class PetService {
  create(createPetDto: CreatePetDto) {
    return 'This action adds a new pet' + JSON.stringify(createPetDto);
  }

  findAll() {
    return `This action returns all pet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pet`;
  }

  update(id: number, updatePetDto: UpdatePetDto) {
    return `This action updates a #${id} pet` + JSON.stringify(updatePetDto);
  }

  remove(id: number) {
    return `This action removes a #${id} pet`;
  }
}
