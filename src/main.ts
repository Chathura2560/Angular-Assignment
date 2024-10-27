import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Adjust the path as necessary

bootstrapApplication(AppComponent)
  .catch((err: unknown) => console.error(err)); // Corrected line

