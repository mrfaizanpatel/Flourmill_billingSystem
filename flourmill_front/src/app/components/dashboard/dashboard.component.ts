import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  users: any[] = [];
  isFormVisible: boolean = false;  // To toggle visibility of the form
  isEditMode: boolean = false;  // Flag to track if we are in edit mode
  selectedTransactions: any[] = [];
  selectedCustomer: any;
  constructor(private userService: UserService,private router:Router) {}

  newCustomer = {  
    cust_id: null,                         // Object to store customer data for submission
    cust_name: '',
    cust_phone: '',
    cust_Address: ''
  };
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Failed to fetch users:', error);
      }
    );
  }

  // Toggle the form visibility
  toggleFormVisibility() {
    this.isFormVisible = !this.isFormVisible;
    // Reset the form when it's closed
    if (!this.isFormVisible) {
      this.resetForm();
    }
  }

  // Add or Update Customer
submitCustomer() {
  if (this.isEditMode) {
    this.userService.updateUser(this.newCustomer).subscribe(() => {
      this.loadUsers();
      this.toggleFormVisibility();
      this.isEditMode = false;
    });
  } else {
    this.userService.addUser(this.newCustomer).subscribe(() => {
      this.loadUsers();
      this.toggleFormVisibility();
    });
  }
}
  //  Edit button logic
   editCustomer(customer: any) {
    this.newCustomer = { ...customer }; // clone the customer
    this.isFormVisible = true;
    this.isEditMode = true;
  }
   // Reset form
   resetForm() {
    this.newCustomer = {
      cust_id: null,
      cust_name: '',
      cust_phone: '',
      cust_Address: ''
    };
    this.isEditMode = false;
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers(); // refresh the list
      });
    }
  }
  
 //to get transactions by cust id 
 viewCustomerDetails(customer: any) {
  this.selectedCustomer = customer;
  this.selectedCustomerId = customer.cust_id;

  // Fetch transactions by customer ID
  this.userService.getTransactionsByCustomerId(customer.cust_id).subscribe({
    next: (transactions) => {
      this.selectedTransactions = transactions;

    },
    error: (err) => {
      console.error('Failed to fetch transactions', err);
    }
  });
}
selectedTransaction: any = null;
selectedCustomerId: number = 0;

submitTransactionU() {
  if (!this.selectedTransaction) return;
  this.userService
    .updateTransaction(this.selectedTransaction.tansaction_id,this.newTransaction)
    .subscribe(
      () => {
        alert('Transaction updated successfully');
        this.selectedTransaction = null;
       
        this.newTransaction = {
          flour_type: '',
          quantity: '',
          unit_price: '',
          in_time: '',
          out_time: '',
          total: 0,
          customer: { cust_id: null }
        };

        if (this.selectedCustomer && this.selectedCustomer.cust_id) {
          this.viewCustomerDetails(this.selectedCustomer);
        } else {
          console.error('Customer not selected or cust_id missing!');
        }
        // this.viewCustomerDetails(this.selectedCustomerId);
        this.isTransactionFormVisible = false;
        this.showAddTransactionForm = false; // close form after update


      },
      (error) => {
        console.error('Error updating transaction:', error);
      }
    );
}

deleteTransaction(id: number) {
  if (confirm('Are you sure you want to delete this transaction?')) {
    this.userService.deleteTransaction(id).subscribe(
      () => {
        alert('Transaction deleted successfully');
        this.viewCustomerDetails(this.selectedCustomerId); // refresh the list
      },
      (error) => {
        console.error('Error deleting transaction:', error);
      }
    );
  }
}

isTransactionFormVisible = false;

showAddTransactionForm: boolean = false;
showTransactions: boolean = false;


newTransaction: any = {
  flour_type: '',
  quantity: '',
  unit_price: '',
  in_time: '',
  out_time: '',
  total: 0
};

toggleAddTransactionForm(customer?: any) {
  this.showAddTransactionForm = !this.showAddTransactionForm;
  if (customer) {
    this.selectedCustomer = customer; // ✅ Set customer when passed
  }
  if(this.showAddTransactionForm && this.selectedCustomer){
  this.newTransaction = {
    flour_type: '',
    quantity: '',
    unit_price: '',
    in_time: '',
    out_time: '',
    total: 0,
    customer: {
      cust_id: this.selectedCustomer.cust_id  
    }
  };
}
else {
  this.newTransaction = {
    flour_type: '',
    quantity: '',
    unit_price: '',
    in_time: '',
    out_time: '',
    total: 0,
    customer: { cust_id: null } // fallback to prevent error
  };
}
}

calculateTotal() {
  const qty = Number(this.newTransaction.quantity);
  const price = Number(this.newTransaction.unit_price);
  this.newTransaction.total = qty * price;
}

submitNewTransaction() {
  if (!this.selectedCustomer?.cust_id) {
    alert("No customer selected");
    return;
  }
  const payload = {
    ...this.newTransaction,
    customer: {cust_id: this.selectedCustomer.cust_id }
  };
  this.userService.addTransaction(payload).subscribe({
    next: () => {
      alert("Transaction added successfully!");
      this.toggleAddTransactionForm(); // hide form
      // this.showAddTransactionForm = false;
      this.viewCustomerDetails(this.selectedCustomer); // refresh list
    },
    error: (err) => {
      console.error("Failed to add transaction", err);
    }
  });
}
hideTransactions(){

}
editTransaction(txnId: number) {
  this.userService.getTransactionById(txnId).subscribe(
    (data: any) => {
      this.selectedTransaction = { ...data };
      // this.newTransaction = { ...this.selectedTransaction };  // Set fields for the form
      this.newTransaction = { ...data }; // clone to avoid two-way bind issues

      this.showAddTransactionForm = true;
    },
    (error) => console.error('Error fetching transaction:', error)
  );
}
cancelTransactionForm() {
  this.selectedTransaction = null;
  this.showAddTransactionForm = false;
}
transactionFormData = {
  flour_type: '',
  quantity: 0,
  unit_price: 0,
  in_time: '',
  out_time: '',
  total: 0
};

// ✅ Call this to prepare form data
updateTransactionForm() {
  if (this.selectedTransaction) {
    this.transactionFormData = { ...this.selectedTransaction };
  } else {
    this.transactionFormData = { ...this.newTransaction };
  }
}

//pdf code

printTransactionPDF(txn: any) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Flour Mill Bill", 80, 20);

  doc.setFontSize(12);
  doc.text(`Transaction ID: ${txn.tansaction_id}`, 20, 40);
  doc.text(`Customer Name: ${this.selectedCustomer.cust_name}`, 20, 50);
  doc.text(`Phone: ${this.selectedCustomer.cust_phone}`, 20, 60);
  doc.text(`Flour Type: ${txn.flour_type}`, 20, 70);
  doc.text(`Quantity: ${txn.quantity}`, 20, 80);
  doc.text(`Unit Price: ₹${txn.unit_price}`, 20, 90);
  doc.text(`Total: ₹${txn.total}`, 20, 100);
  doc.text(`In Time: ${new Date(txn.in_time).toLocaleString()}`, 20, 110);
  doc.text(`Out Time: ${new Date(txn.out_time).toLocaleString()}`, 20, 120);

  doc.text("Thank you for your business!", 60, 140);

  doc.save(`Bill_${txn.tansaction_id}.pdf`);
}

// logout() {
//   sessionStorage.removeItem('isLoggedIn');
//   this.router.navigate(['/login']);
// }
logout() {
  // Clear all session storage
  sessionStorage.clear();
  
  // Navigate to login and prevent back navigation
  this.router.navigate(['/login'], {
    replaceUrl: true // This prevents going back to previous page
  });
  
  // Optional: Clear browser cache
  window.location.reload();
}

}
