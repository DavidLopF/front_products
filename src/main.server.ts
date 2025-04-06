import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

export default async function bootstrap() {
  try {
    return await bootstrapApplication(AppComponent, config);
  } catch (err) {
    console.error('Error during bootstrap:', err);
    throw err;
  }
}
