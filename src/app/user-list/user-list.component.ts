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
  userList: any[] = [];
  filteredUserList: any[] = [];
  paginatedUserList: any[] = []; // Users for the current page
  private http = inject(HttpClient);

  userId: string = '';
  searchId?: string;
  searchTitle: string = '';
  searchBody: string = '';
  buttonAction: boolean = false;

  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;
  isLoading: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  ngOnInit(): void {}

  getAllUsers() {
    this.buttonAction = true;
    this.isLoading = true;
    const url = this.userId
      ? `https://jsonplaceholder.typicode.com/posts?userId=${this.userId}`
      : 'https://jsonplaceholder.typicode.com/posts';

    this.http.get(url).subscribe(
      (result: any) => {
        this.userList = result;
        this.filteredUserList = result;
        this.alertMessage = 'Users fetched successfully!';
        this.alertType = 'success';
        this.isLoading = false;
        this.setPagination();
        this.clearAlertAfterDelay();
      },
      (error) => {
        console.error('Error fetching users:', error);
        this.alertMessage = 'Failed to fetch users. Please try again.';
        this.alertType = 'error';
        this.isLoading = false;
        this.clearAlertAfterDelay();
      }
    );
  }

  onSearch() {
    this.filteredUserList = this.userList.filter((user) => {
      const matchesId = this.searchId ? user.id.toString() === this.searchId : true;
      const matchesTitle = this.searchTitle ? user.title.toLowerCase().includes(this.searchTitle.toLowerCase()) : true;
      const matchesBody = this.searchBody ? user.body.toLowerCase().includes(this.searchBody.toLowerCase()) : true;
      return matchesId && matchesTitle && matchesBody;
    });

    this.setPagination();
    this.alertMessage = this.filteredUserList.length
      ? 'Filter applied successfully!'
      : 'No results found for the applied filter.';
    this.alertType = this.filteredUserList.length ? 'success' : 'error';
    this.clearAlertAfterDelay();
  }

  cancelFilter() {
    this.searchId = '';
    this.searchTitle = '';
    this.searchBody = '';
    this.filteredUserList = this.userList;
    this.setPagination();
  }

  buttonClick() {
    this.getAllUsers();
  }

  setPagination() {
    this.totalPages = Math.ceil(this.filteredUserList.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedList();
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedUserList = this.filteredUserList.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }

  private clearAlertAfterDelay() {
    setTimeout(() => {
      this.alertMessage = null;
      this.alertType = null;
    }, 3000);
  }
}
