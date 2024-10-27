import { Component, OnInit, inject } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
})
export class UserListComponent implements OnInit {
  userList: any[] = []; // Original list of fetched users
  filteredUserList: any[] = []; // List to display after filtering
  private http = inject(HttpClient);

  userId: string = ''; // Input for dynamic URL fetching
  searchId?: string; // Filter by ID
  searchTitle: string = ''; // Filter by Title
  searchBody: string = ''; // Filter by Body
  buttonAction: boolean = false;

  // Alert message properties
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  // Loading state
  isLoading: boolean = false;

  ngOnInit(): void {}

  // Fetch users based on userId or fetch all users if userId is empty
  getAllUsers() {
    this.buttonAction = true;
    this.isLoading = true; // Start loading
    const url = this.userId
      ? `https://jsonplaceholder.typicode.com/posts?userId=${this.userId}`
      : 'https://jsonplaceholder.typicode.com/posts';

    this.http.get(url).subscribe(
      (result: any) => {
        this.userList = result;
        this.filteredUserList = result;
        this.alertMessage = 'Users fetched successfully!';
        this.alertType = 'success';
        this.isLoading = false; // Stop loading
        this.clearAlertAfterDelay();
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.alertMessage = 'Failed to fetch users. Please try again.';
        this.alertType = 'error';
        this.isLoading = true; // Stop loading
        this.clearAlertAfterDelay();
      }
    );
  }

  // Filter the user list based on search fields
  onSearch() {
    this.filteredUserList = this.userList.filter((user) => {
      const matchesId = this.searchId ? user.id.toString() === this.searchId : true;
      const matchesTitle = this.searchTitle ? user.title.toLowerCase().includes(this.searchTitle.toLowerCase()) : true;
      const matchesBody = this.searchBody ? user.body.toLowerCase().includes(this.searchBody.toLowerCase()) : true;
      return matchesId && matchesTitle && matchesBody;
    });

    if (this.filteredUserList.length > 0) {
      this.alertMessage = 'Filter applied successfully!';
      this.alertType = 'success';
    } else {
      this.alertMessage = 'No results found for the applied filter.';
      this.alertType = 'error';
    }
    this.clearAlertAfterDelay();
  }

  cancelFilter() {
    this.searchId = '';
    this.searchTitle = '';
    this.searchBody = '';
    this.filteredUserList = this.userList; // Reset to the full list
  }

  buttonClick() {
    this.getAllUsers();
  }

  // Method to clear the alert message after a delay
  private clearAlertAfterDelay() {
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000); // Clear after 3 seconds
  }
}
