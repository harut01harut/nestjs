import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dto/create-tag.dto';
import { UpdateTagDto } from '../dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagsService {
  findAll() {
    throw new Error('Method not implemented.');
  }

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>
  ){}

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto)
 
    await this.tagRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    let results = await this.tagRepository.find({
      where: {
        id: In(tags),
      }
    })

    return results;
  }

  public async delete(id: number) {
    await this.tagRepository.delete(id);
  
    return {
      deleted: true,
      id,
    }
  }

  public async softDelete(id: number) {
    await this.tagRepository.softDelete(id);
  
    return {
      deleted: true,
      id,
    }
  }
}
