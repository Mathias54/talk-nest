import {Injectable, InternalServerErrorException} from '@nestjs/common';
import * as mongodb from 'mongodb';
import {Collection} from 'mongodb';
import {from, NEVER, Observable, throwError} from 'rxjs';
import {catchError, finalize, map, mergeMap} from 'rxjs/operators';

@Injectable()
export class DatabaseService {

    collection(collection: string): Observable<Collection<any>> {

        const url = `mongodb://localhost:27017`;
        let dbInstance;

        const toCollection = db => {
            dbInstance = db;
            return db.db('nest').collection(collection);
        };

        const internalError = () => {
            throw new InternalServerErrorException({
                erro: 'Erro ao acessar banco de dados',
                status: 500,
            }, '500');
        };

        const closeConnection = () => {
            dbInstance.close();
        };

        return from(mongodb.MongoClient.connect(url))
            .pipe(
                finalize(closeConnection),
                map(toCollection),
                catchError(internalError),
            );
    }
}
