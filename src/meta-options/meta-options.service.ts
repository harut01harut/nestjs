import { Injectable } from '@nestjs/common';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from './meta-option.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaOptionsService {

  constructor(
    /**
     * Inject met-options
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>
  ){}


  async create(createMetaOptionDto: CreateMetaOptionDto) {
    const metaOption = this.metaOptionRepository.create(createMetaOptionDto);
 
    return await this.metaOptionRepository.save(metaOption);
  }

  findAll() {
    return `This action returns all metaOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metaOption`;
  }

  update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    return `This action updates a #${id} metaOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} metaOption`;
  }
}
