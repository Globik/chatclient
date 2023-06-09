import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
//import  fs  from 'fs';
const fs = require("fs");
import {join} from 'path';

async function bootstrap() {
	var appConfig = {};
	if(process.env.NODE_ENV=="prod"){
		const httpsOptions = {
			key: fs.readFileSync('/home/globi/chatikon/data/key.pem'),// privkey.pem
			cert: fs.readFileSync('/home/globi/chatikon/data/cert.pem') //fullchain.pem
		};
		appConfig = { httpsOptions }
	}
  const app = await NestFactory.create<NestExpressApplication>(AppModule, appConfig);
  
  var port;
  if(process.env.NODE_ENV=="prod"){
	  
   port = 443;
   
}else{
	port = process.env.PORT;
}

  const config = new DocumentBuilder()
    .setTitle('Чат-рулетка')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document);
  
  app.useStaticAssets(join(__dirname, '..', 'storage/dist'));
  app.setGlobalPrefix('api');
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port, () => console.log(`Server was started: http://localhost:${port}`));
}
bootstrap();
