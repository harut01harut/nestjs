import { Inject, Injectable } from "@nestjs/common";
import { PaginationQueryDto } from "../dtos/pagination-query.dto";
import { ObjectLiteral, Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { Paginated } from "../interfaces/paginated.interface";

@Injectable()
export class PaginationProvider {

    constructor(
        @Inject(REQUEST)
        private readonly request: Request,
    ){}

    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto : PaginationQueryDto,
        repository: Repository<T>
    ): Promise<Paginated<T>> {
        let results = await repository.find({
            skip: (paginationQueryDto.page - 1) * paginationQueryDto.limit,
            take: paginationQueryDto.limit
        })

        /**
         * Create the request URLs
         */
        
        const baseURL = 
        this.request.protocol 
        + '://' 
        + this.request.headers.host
        + '/'

        const newUrl = new URL(this.request.url, baseURL);
        
        /**
         * Calculating page number
         */

        const totalItems = await repository.count();
        const totalPages = Math.ceil(totalItems/paginationQueryDto.limit);
        const nextPage = paginationQueryDto.page === totalPages 
            ? paginationQueryDto.page
            : paginationQueryDto.page + 1;
        const previousPage = paginationQueryDto.page === 1 
            ? paginationQueryDto.page
            : paginationQueryDto.page - 1;
        
        const finalResult: Paginated<T> = {
            data: results,
            meta: {
                itemsPerPage: paginationQueryDto.limit,
                totalItems: totalItems,
                currentPage: paginationQueryDto.page,
                totalPage: totalPages,
            },
            links: {
                first: 
                `${newUrl.origin}${newUrl.pathname}?limit=&${paginationQueryDto.limit}&page=1`,
                last: 
                `${newUrl.origin}${newUrl.pathname}?limit=&${paginationQueryDto.limit}&page=${totalPages}`,
                current: 
                `${newUrl.origin}${newUrl.pathname}?limit=&${paginationQueryDto.limit}&page=${paginationQueryDto.page}`,
                next: 
                `${newUrl.origin}${newUrl.pathname}?limit=&${paginationQueryDto.limit}&page=${nextPage}`,
                previous:
                `${newUrl.origin}${newUrl.pathname}?limit=&${paginationQueryDto.limit}&page=${previousPage}`,
            }
        }
            
        return finalResult;
    }
}