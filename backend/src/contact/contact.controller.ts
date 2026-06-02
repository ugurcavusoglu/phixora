import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

class ContactDto {
  @IsString() @IsNotEmpty() @MaxLength(100) name: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() @MaxLength(200) subject: string;
  @IsString() @IsNotEmpty() @MaxLength(2000) message: string;
}

@Controller('contact')
export class ContactController {
  @Post()
  @HttpCode(200)
  submit(@Body() dto: ContactDto) {
    // Log to console — replace with email service if needed
    console.log(`[Contact] From: ${dto.email} | Subject: ${dto.subject}`);
    return { success: true, message: 'Message received. Thank you!' };
  }
}
