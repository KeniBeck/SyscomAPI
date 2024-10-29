import { IsString, IsNotEmpty, IsInt } from "@nestjs/class-validator";
export class CreateCategoriaDto {
    /**
     * @example '22'   
     */
    
    @IsString()
    @IsNotEmpty()
    readonly id: string;

    /**
     * @example 'Videovigilancia'
     */
    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    /**
     * @example 1
     */
    @IsInt()
    @IsNotEmpty()
    readonly nivel: number;

    
}
