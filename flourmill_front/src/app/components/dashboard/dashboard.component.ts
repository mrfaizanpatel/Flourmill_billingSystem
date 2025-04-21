import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  users: any[] = [];
  isFormVisible: boolean = false;  // To toggle visibility of the form
  isEditMode: boolean = false;  // Flag to track if we are in edit mode
  selectedTransactions: any[] = [];
  selectedCustomer: any;

  constructor(private userService: UserService,private router:Router,private fb: FormBuilder) {
    // this.loginForm = this.fb.group({
    //   username: ['', Validators.required],
    //   password: ['', Validators.required]
    // });
  
    // this.signupForm = this.fb.group({
    //   fullName: ['', Validators.required],
    //   email: ['', [Validators.required, Validators.email]],
    //   phoneNumber: [''],
    //   address: [''],
    //   role: ['Customer'],
    //   status: ['Active'],
    //   joinedDate: [new Date()],
    //   username: ['', Validators.required],
    //   password: ['', Validators.required],
    //   notes: ['']
    // });
  }

  newCustomer = {  
    cust_id: null,                         // Object to store customer data for submission
    cust_name: '',
    cust_phone: '',
    cust_Address: ''
  };
  ngOnInit(): void {
    this.loadUsers();
    this.generateWeekOptions(); // Initialize week dropdown

  }

  // Add this property to your DashboardComponent class
flourTypes: string[] = [
  'wheat',
  'jawaar',
  'baajra',
  'chilli_powder',
  'makka',
  'moong'
];
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

//**********************************////////////////************************************ */ */
// Add these properties to your component
businessReport: any = null;
showReport = false;

// Add these methods to your component
generateBusinessReport() {
  this.userService.getalltransactions().subscribe(
    (transactions) => {
      this.businessReport = this.processTransactions(transactions);
      this.showReport = true;
    },
    (error) => {
      console.error('Failed to fetch transactions:', error);
    }
  );
}

processTransactions(transactions: any[]): any {
  const report = {
    totalRevenue: 0,
    totalQuantity: 0,
    transactionCount: transactions.length,
    flourTypes: {} as {[key: string]: any},
    customers: {} as {[key: string]: any},
    estimatedProfit: 0 // Add profit field

  };

  transactions.forEach(transaction => {
    // Calculate totals
    report.totalRevenue += transaction.total || 0;
    report.totalQuantity += Number(transaction.quantity) || 0;

    // Group by flour type
    const flourType = transaction.flour_type.toLowerCase();
    if (!report.flourTypes[flourType]) {
      report.flourTypes[flourType] = {
        quantity: 0,
        total: 0,
        unitPrice: transaction.unit_price,
        transactions: 0
      };
    }
    report.flourTypes[flourType].quantity += Number(transaction.quantity);
    report.flourTypes[flourType].total += Number(transaction.total);
    report.flourTypes[flourType].transactions += 1;
    report.flourTypes[flourType].unitPrice = transaction.unit_price; // Keep last unit price

    // Group by customer (optional)
    const custId = transaction.customer.cust_id;
    if (!report.customers[custId]) {
      report.customers[custId] = {
        name: transaction.customer.cust_name,
        total: 0,
        transactions: 0
      };
    }
    report.customers[custId].total += Number(transaction.total);
    report.customers[custId].transactions += 1;
    report.estimatedProfit = report.totalRevenue * 0.3;

  });

  return report;
}

getFlourTypes(): string[] {
  return Object.keys(this.businessReport?.flourTypes || {});
}

getCustomers(): any[] {
  return Object.values(this.businessReport?.customers || {});
}

printBusinessReport() {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text(`Weekly Report - ${this.businessReport.weekLabel}`, 60, 20);

  // Report Header
  doc.setFontSize(18);
  doc.text('Flour Mill Business Report', 70, 20);
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Summary Section *************************************added revenue code here ************************
  doc.setFontSize(14);
  doc.text('Summary', 14, 40);
  doc.setFontSize(12);
  doc.text(`Gross Revenue: ₹${this.businessReport.totalRevenue}`, 20, 95);
  doc.text(`Estimated Profit (30%): ₹${(this.businessReport.estimatedProfit).toFixed(2)}`, 20, 105);
  doc.text(`Total Revenue: ₹${this.businessReport.totalRevenue}`, 14, 50);
  doc.text(`Total Quantity Sold: ${this.businessReport.totalQuantity} kg`, 14, 60);
  doc.text(`Total Transactions: ${this.businessReport.transactionCount}`, 14, 70);
  
  // Flour Details Section
  doc.setFontSize(14);
  doc.text('Flour Details', 14, 85);
  doc.setFontSize(12);
  
  let yPosition = 95;
  Object.keys(this.businessReport.flourTypes).forEach(flourType => {
    const flour = this.businessReport.flourTypes[flourType];
    doc.text(`${flourType}:`, 14, yPosition);
    doc.text(`Quantity: ${flour.quantity} kg`, 50, yPosition);
    doc.text(`Unit Price: ₹${flour.unitPrice}`, 100, yPosition);
    doc.text(`Total: ₹${flour.total}`, 150, yPosition);
    yPosition += 10;
  });
  
  // Customer Details Section (optional)
  yPosition += 10;
  doc.setFontSize(14);
  doc.text('Top Customers', 14, yPosition);
  doc.setFontSize(12);
  yPosition += 10;
  
  this.getCustomers().slice(0, 5).forEach((customer: any) => {
    doc.text(`${customer.name}:`, 14, yPosition);
    doc.text(`Transactions: ${customer.transactions}`, 70, yPosition);
    doc.text(`Total: ₹${customer.total}`, 120, yPosition);
    yPosition += 10;
  });
  
  doc.save('Business_Report.pdf');
}
//***********************************week dropodown selection code ************* */
// Add to your component class


weeks: any[] = []; // Will store available weeks
selectedWeek: string = ''; // Currently selected week
isLoadingReport = false; // Loading state

// Add these methods to your component
generateWeekOptions() {
  this.weeks = [];
  const currentDate = new Date();
  
  // Generate options for last 12 weeks
  for (let i = 0; i < 12; i++) {
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDate.getDay() - (7 * i));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    const weekNumber = this.getWeekNumber(startDate);
    const weekLabel = `Week ${weekNumber} (${this.formatDate(startDate)} - ${this.formatDate(endDate)})`;
    const weekValue = `${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
    
    this.weeks.push({
      label: weekLabel,
      value: weekValue,
      start: startDate,
      end: endDate
    });
  }
}

getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDays = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);
}

formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

generateWeeklyReport() {
  if (!this.selectedWeek) return;
  
  this.isLoadingReport = true;
  const selectedWeekData = this.weeks.find(w => w.value === this.selectedWeek);
  
  this.userService.getalltransactions().subscribe(
    (transactions) => {
      // Filter transactions for the selected week
      const weeklyTransactions = transactions.filter((txn: any) => {
        const txnDate = new Date(txn.in_time);
        return txnDate >= selectedWeekData.start && txnDate <= selectedWeekData.end;
      });
      
      this.businessReport = this.processTransactions(weeklyTransactions);
      this.businessReport.weekLabel = selectedWeekData.label;
      this.showReport = true;
      this.isLoadingReport = false;
    },
    (error) => {
      console.error('Failed to fetch transactions:', error);
      this.isLoadingReport = false;
    }
  );
}

// isSignupMode = true;

// loginForm!: FormGroup;
// signupForm!: FormGroup;
 message = '';

// constructor(private fb: FormBuilder, private signupService: SignupService, private authService: AuthService) {
//   this.loginForm = this.fb.group({
//     username: ['', Validators.required],
//     password: ['', Validators.required]
//   });

//   this.signupForm = this.fb.group({
//     fullName: ['', Validators.required],
//     email: ['', [Validators.required, Validators.email]],
//     phoneNumber: [''],
//     address: [''],
//     role: ['Customer'],
//     status: ['Active'],
//     joinedDate: [new Date()],
//     username: ['', Validators.required],
//     password: ['', Validators.required],
//     notes: ['']
//   });
// }

// toggleMode() {
//   this.isSignupMode = !this.isSignupMode;
//   this.message = '';
// }

// onLoginSubmit() {
//   if (this.loginForm.valid) {
//     this.userService.login(this.loginForm.value).subscribe({
//       next: (res) => {
//         this.message = 'Login successful';
//       },
//       error: (err) => {
//         this.message = 'Login failed';
//       }
//     });
//   }
// }

// onSignupSubmit() {
//   if (this.signupForm.valid) {
//     this.userService.signup(this.signupForm.value).subscribe({
//       next: () => {
//         this.message = 'Signup successful';
//         this.signupForm.reset();
//         this.isSignupMode = false;
//       },
//       error: err => {
//         this.message = 'Signup failed';
//       }
//     });
//   }
// }

}
