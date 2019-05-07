import {HttpService, Injectable, InternalServerErrorException} from '@nestjs/common';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

interface IGenderize {
    'name': string;
    'gender': 'male' | 'female';
    'probability': 1;
    'count': 4373;
}

@Injectable()
export class GenderizeService {
    constructor(
        private readonly httpService: HttpService,
    ) {}

    findGenderByName(name: string): Observable<string> {
        return this.httpService
            .get<IGenderize>(`https://api.genderize.io/?name=${name}`)
            .pipe(
                map(response => response.data.gender),
            );
    }
}
