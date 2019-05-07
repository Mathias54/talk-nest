import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {DatabaseService} from '../database/database.service';
import {catchError, filter, map, mergeMap, tap, throwIfEmpty} from 'rxjs/operators';
import {from} from 'rxjs';

@Injectable()
export class UserService {

    constructor(
        private readonly databaseService: DatabaseService,
    ) {}

    insertNewUser(user) {

        const insertOne$ = (collection) => {
            return from(collection.insertOne(user))
                .pipe(
                    catchError(() => {
                        throw new InternalServerErrorException({
                            erro: 'Erro ao persistir usuário',
                            status: 500,
                        }, '500');
                    }),
                );
        };

        return this.databaseService
            .collection('user')
            .pipe(
                mergeMap(insertOne$),
            );
    }

    findOneByEmail(email: string) {

        const findOne$ = (collection) => {
            return from(collection.findOne({email}));
        };

        return this.databaseService
            .collection('user')
            .pipe(
                mergeMap(findOne$),
            );
    }
}
