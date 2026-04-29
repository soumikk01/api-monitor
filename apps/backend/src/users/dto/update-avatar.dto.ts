import { IsInt, Min, Max } from 'class-validator';

export class UpdateAvatarDto {
  @IsInt()
  @Min(0)
  @Max(29) // AVATARS array has 30 entries (indices 0–29)
  avatar: number;
}
