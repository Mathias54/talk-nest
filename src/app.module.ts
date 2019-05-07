import {HttpModule, Module} from '@nestjs/common';
import {UserController} from './controllers/user/user.controller';
import {UserService} from './services/user/user.service';
import {DatabaseService} from './services/database/database.service';
import {GenderizeService} from './services/genderize/genderize.service';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [GenderizeService, UserService, DatabaseService],
})
export class AppModule {}
