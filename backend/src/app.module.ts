import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HistoryModule } from './history/history.module';
import { ImageModule } from './image/image.module';
import { ContactModule } from './contact/contact.module';
import { GemsModule } from './gems/gems.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HistoryModule,
    ImageModule,
    ContactModule,
    GemsModule,
  ],
})
export class AppModule {}
