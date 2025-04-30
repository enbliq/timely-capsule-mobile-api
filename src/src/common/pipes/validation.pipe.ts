import { type PipeTransform, Injectable, type ArgumentMetadata, BadRequestException } from "@nestjs/common"
import { validate } from "class-validator"
import { plainToClass } from "class-transformer"

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object)

    if (errors.length > 0) {
      const formattedErrors = errors.map((err) => {
        const constraints = err.constraints ? Object.values(err.constraints) : ["Invalid value"]
        return {
          property: err.property,
          errors: constraints,
        }
      })

      throw new BadRequestException({
        message: "Validation failed",
        errors: formattedErrors,
      })
    }

    return value
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
