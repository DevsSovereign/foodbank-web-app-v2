export type OrderHistoryStatus =
  | "completed"
  | "cancelled"
  | "inProgress"
  | "All Orders"
  | "pending"
  | "";

export type SingleOrderHistoryStatus = "completed" | "cancelled" | "outForDelivery";

export interface UserLinkedBank {
  institution: {
    name: string;
    branch: string;
    bank_code: string;
  };
  account_name: string;
  account_number: string;
  account_type: string;
  bank_name: string;
  account_designation: string;
  createdAt: string;
  isMandate: boolean;
  _id: string;
  id: string;
}
export interface UserResponse {
  accountOfficerCode: string;
  firstName: string;
  lastName: string;
  bvn: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  middleName: string;
  accountType: string;
  adminVerification: string;
  bankStatement: string;
  bankStatementPassword: string;
  blockReason: null;
  blocked: boolean;
  categoryType: "individual";
  churchData: null;
  createdAt: string;
  currentState: string;
  deliveryAddress: string;
  deliveryContact: string;
  deliveryContact2: [];
  deliveryDateOption: string;
  documentCheck: boolean;
  email: string;
  emandateValidation: { isMandateOrder: boolean; isMandatePayment: boolean };
  employed: { workIDCard: []; salaryAccounts: [] };
  employmentStatus: string;
  id: string;
  isApproved: boolean;
  isBusinessOwner: boolean;
  isBvnIgree: boolean;
  isComplete: string;
  isCreditGiven: boolean;
  isDeleted: boolean;
  isEmailVerified: boolean;
  isFirstOrderCompleted: boolean;
  isPayment: boolean;
  isPaystackIdentified: boolean;
  lagosData: null;
  linkedBanks: UserLinkedBank[];
  monoAccount: null;
  numberOfCards: number;
  passwordHash: string;
  paystackIdentifications: [];
  phoneNumber: string;
  privateOrganizationData: null;
  referralBonusBalance: number;
  referralBonusPaidCustomers: [];
  referralCode: string;
  referralLink: string;
  referralRewardedCustomers: [];
  referredCustomers: [];
  referrerId: null;
  selfEmployed: { businessAccounts: [] };
  stateGovernmentData: {
    staffId: string;
    monthlySalary: string;
    officeAddress: string;
    salaryAccountBankName: string;
    salaryAccountName: string;
    salaryAccountNumber: string;
    ministryId: string;
    stateGovernmentId: string;
  };
  status: string;
  student: { studentIdCard: []; accounts: [] };
  switchFlexible: boolean;
  updatedAt: string;
  userPassword: string;
  userType: [];
  virtualAccount: {
    walletbalance: number;
    accountName: string;
    bankName: string;
    createdAt: string;
    customerIdentifier: string;
    virtualAccountNumber: string;
  };
  _id: string;
}
interface OrderItems {
  name: string;
  measurement: string;
  image: string;
  type: string;
  quantity: number;
  totalPrice: number;
  productId: string;
  _id: string;
}

export interface HistoryData {
  _id: string;
  orderItems: OrderItems[];
  status: OrderHistoryStatus;
  orderNumber: string;
  orderType: string;
  deliveryDetails: string;
  allItemsTotalPrice: number;
  orderDate: string;
  deliveryFee: number;
  serviceFee: number;
  interest: number;
  topUpAmount: number;
  discount: number;
}

export interface UserOrderHistory {
  data: HistoryData[];
  nextCursor: string;
  isNextPage: boolean;
  count: number;
}

interface DeliveryRider {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  image: string;
}

export type SingleOrderHistory = HistoryData & {
  status: SingleOrderHistoryStatus;
  riderId: DeliveryRider;
};

interface LoanRecord {
  totalLoan: number;
  paidLoan: number;
  amountLeft: number;
  payDate: string;
  _id: string;
}
export interface UserRepaymentHistory {
  _id: string;
  userId: Pick<UserResponse, "_id" | "email" | "phoneNumber" | "firstName" | "lastName">;
  loanRecord: LoanRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface UserNotification {
  id: string;
}

export type TrackOrderResponse = HistoryData & {
  userId: string;
  isXmasPackage: boolean;
  isPaymentDS: boolean;
  isDispute: boolean;
  deliveryContact2: string[];
  deliveryDateOption: string;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
};

export interface NotificationMessage {
  body: string;
  isRead: boolean;
  timestamp: string;
  title: string;
  _id: string;
}

export interface UserNotificationsResponse {
  timeAgo: string;
  message: NotificationMessage;
}
