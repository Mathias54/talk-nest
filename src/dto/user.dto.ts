import { ApiModelProperty } from '@nestjs/swagger';

export class UserPostDto {
    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly email: string;

    @ApiModelProperty()
    readonly borningYear: number;
}

export class UserGetParams {
    @ApiModelProperty()
    readonly email: string;
}
