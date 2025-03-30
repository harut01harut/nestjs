import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { fileTypes } from "./enums/file-types.enum";

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: false,
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: false,
    })
    path: string;

    @Column({
        type: 'enum',
        enum: fileTypes,
        default: fileTypes.IMAGE,
        nullable: false,
    })
    type: fileTypes;

    @Column({
        type: 'varchar',
        length: 128,
        nullable: false,
    })
    mime: string; // format of the file

    @Column({
        type: 'varchar',
        length: 1024,
        nullable: false,
    })
    size: number;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    updateDate: Date;
}