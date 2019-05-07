import {BadRequestException, Body, Controller, Get, Param, Post, UsePipes} from '@nestjs/common';
import {Observable} from 'rxjs';
import * as Joi from 'joi';
import {UserService} from '../../services/user/user.service';
import {UserGetParams, UserPostDto} from '../../dto/user.dto';
import {filter, map, mergeMap, tap, throwIfEmpty} from 'rxjs/operators';
import {GenderizeService} from '../../services/genderize/genderize.service';
import {JoiValidationPipe} from '../../pipes/JoiValidation/JoiValidation.pipe';

const postSchema = Joi.object().keys({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }),
    borningYear: Joi.number().required(),
});

const getSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }),
});

@Controller('/user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly genderize: GenderizeService,
    ) {}

    @Post()
    @UsePipes(new JoiValidationPipe(postSchema))
    postUser(@Body() user: UserPostDto) {

        const {email, name} = user;

        const addGenderToUser = (gender) => {
            const newUser: any = {...user};
            newUser.gender = gender
                ? gender
                : null;
            return newUser;
        };

        const emailJaCadastrado = (resultado) => {
            if (!resultado) {
                return;
            }
            throw new BadRequestException({
                erro: 'Email já registrado',
                status: 500,
            }, '500');
        };

        return this.userService
            .findOneByEmail(email)
            .pipe(
                tap(emailJaCadastrado),
                mergeMap(() => this.genderize.findGenderByName(name)),
                map(addGenderToUser),
                mergeMap((newUser) => this.userService.insertNewUser(newUser)),
            );

        // return this.userService.insertNewUser(user);
        // return this.userService.findOneByEmail(email);
    }

    @Get('/email/:email')
    @UsePipes(getSchema)
    findUser(@Param() params: UserGetParams) {
        const {email} = params;
        return this.userService
            .findOneByEmail(email)
            .pipe(
                filter( result => result !== null),
                throwIfEmpty(() => {
                    throw new BadRequestException({
                        erro: `Nenhuma usuário para o email ${email}`,
                        status: 204,
                    }, '500');
                }),
            );
    }
}

const helloWorld = () => {
    return 'Hello World For Here';
};

const helloWorldForPromise = () => {
    return new Promise(resolve => {
        resolve('Hello World From Promise');
    });
};

const helloWorldFromObservable = () => {
    return new Observable(obs => {
        obs.next('Hello From Observable');
        obs.complete();
    });
};

const helloWorldFromObservableWithPromise = () => {
    return new Observable(obs => {
        obs.next(new Promise(resolve => {
            resolve('Hello World from a promise inside a Observable');
        }));
        obs.complete();
        obs.complete();
    });
};

const helloWorldFromPromiseWithObservable = () => {
    return new Promise(resolve => {
        resolve(new Observable(obs => {
            obs.next('Hello World from a Observable inside a Promise');
            obs.complete();
        }));
    });
};
