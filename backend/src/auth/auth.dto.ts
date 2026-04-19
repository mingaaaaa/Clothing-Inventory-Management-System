import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  // 强制要求该字段的值必须是字符串类型。
  @IsString()
  // 强制要求该字段的值不能为空。
  @IsNotEmpty()
  // 该类用于 DTO 数据验证，属性值由外部传入而非内部初始化，
  // 因此使用了非空断言操作符（!）来告诉 TypeScript 编译器这个属性在使用前会被赋值。
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
