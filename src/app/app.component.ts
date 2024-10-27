import { Component } from '@angular/core';
import { UserListComponent } from './user-list/user-list.component'; // Adjust the path as necessary

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [UserListComponent] // Import UserListComponent here
})
export class AppComponent {
  title = ''; // Set your title here
}










