export type OrderHistoryStatus =
  | "completed"
  | "cancelled"
  | "inProgress"
  | "All Orders"
  | "pending"
  | "";

export type SingleOrderHistoryStatus = "completed" | "cancelled" | "outForDelivery";

export interface LinkedBankInstitution {
  name: string;
  branch: string;
  bank_code: string;
}

export interface UserLinkedBank {
  institution: LinkedBankInstitution;
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

export interface EmandateValidation {
  isMandateOrder: boolean;
  isMandatePayment: boolean;
}

export interface EmployedData {
  workIDCard: [];
  salaryAccounts: [];
}

export interface SelfEmployedData {
  businessAccounts: [];
}

export interface StudentData {
  studentIdCard: [];
  accounts: [];
}

export interface StateGovernmentData {
  staffId: string;
  monthlySalary: string;
  officeAddress: string;
  salaryAccountBankName: string;
  salaryAccountName: string;
  salaryAccountNumber: string;
  ministryId: string;
  stateGovernmentId: string;
}

export interface VirtualAccount {
  walletbalance: number;
  accountName: string;
  bankName: string;
  createdAt: string;
  customerIdentifier: string;
  virtualAccountNumber: string;
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
  accountType: "flexible" | "outright";
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
  emandateValidation: EmandateValidation;
  employed: EmployedData;
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
  selfEmployed: SelfEmployedData;
  stateGovernmentData: StateGovernmentData;
  status: string;
  student: StudentData;
  switchFlexible: boolean;
  updatedAt: string;
  userPassword: string;
  userType: [];
  virtualAccount: VirtualAccount;
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

export interface NotificationItem {
  timeAgo: string;
  message: NotificationMessage;
}

// Notifications are returned grouped by date string keys (e.g. "Fri Feb 27 2026")
export type UserNotificationsResponse = Record<string, NotificationItem[]>;

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  address?: string;
  deliveryAddress: string;
}

export interface TransactionItem {
  _id: string;
  status: string;
  amount: number;
  description: string;
  time: string;
  date: string;
}

export type TransactionHistoryResponse = {
  status: string;
  message: string;
  data: TransactionItem[];
  nextCursor: string | null;
  isNextPage: boolean;
  count: number;
};

export interface RewardHistory {
  _id: string;
  userId: string;
  reward: string;
  rewardType: GamificationRewardType;
  order: string;
  status: "active" | "used";
  expiresAt: string;
  wonOn: string;
  createdAt: string;
  updatedAt: string;
  checkoutCategory: string;
  claimedAt: string;
  discountSpinBonus: string;
  discountSpinDiscount: number;
  displayLabel: string;
  issuedAt: string;
  presentationSeen: boolean;
  promoCodeDetails: { amount: number; code: string; discount: number | null };
  source: GamificationRewardType;
  usedAt: string;
}

export type GamificationPresentationType = "banner" | "modal" | "inline";
export type GamificationRewardType =
  | "discountSpin"
  | "promoCode"
  | "freeDelivery"
  | "checkoutCategory";

interface CheckoutGamificationCategory {
  eligible: boolean;
  offerId: string;
  presentationType: GamificationPresentationType;
  priority: number;
  showToUser: boolean;
}

export interface UsedClaimResponse {
  kind: GamificationRewardType;
  rewardType: GamificationRewardType;
  active: boolean;
  rewardId: string;
  order: string;
  status: "active" | "used";
  usedAt: string;
  source: GamificationRewardType;
  displayLabel: string;
}

export interface GamificationReward {
  active: boolean;
  checkoutCategory: string;
  claimedAt: string;
  discountSpinBonus: number;
  discountSpinDiscount: number;
  displayLabel: string;
  expiresAt: string;
  issuedAt: string;
  order: null;
  presentationSeen: boolean;
  promoCodeDetails: null;
  reward: string;
  rewardId: string;
  rewardType: GamificationRewardType;
  source: string;
  used: boolean;
  usedAt: string;
}

export interface ClaimGamificationPayload {
  reward: string;
  rewardType: GamificationRewardType;
  orderId?: string;
  expiresAt?: string;
  status?: string;
  discountSpinDiscount?: number;
  discountSpinBonus?: number;
  promoCodeDetails?: number;
  checkoutCategory?: number;
}

export interface ClaimRewardResponse {
  userId: string;
  reward: string;
  rewardType: GamificationRewardType;
  discountSpinBonus: number | null;
  discountSpinDiscount: number | null;
  promoCodeDetails: number | null;
  checkoutCategory: number | null;
  order: string;
  status: string;
  expiresAt: string | null;
  issuedAt: string;
  claimedAt: string;
  usedAt: string;
  presentationSeen: false;
  source: GamificationRewardType;
  displayLabel: string;
  _id: string;
  wonOn: string;
  createdAt: string;
  updatedAt: string;
}

interface DiscountSpinGamificationCategory {
  delaySeconds: number;
  durationSeconds: number;
  eligible: boolean;
  offerId: string;
  presentationType: GamificationPresentationType;
  priority: number;
  showToUser: boolean;
  reward: GamificationReward;
}

interface FreeDeliveryGamificationCategory {
  durationSeconds: number;
  eligible: boolean;
  offerId: string;
  presentationType: GamificationPresentationType;
  priority: number;
  reward: GamificationReward;
  showToUser: boolean;
}

interface PromoCodeGamificationCategory {
  eligible: boolean;
  enabled: boolean;
  offerId: string;
  presentationType: GamificationPresentationType;
  priority: number;
  showToUser: boolean;
}

export interface AdminGamifiedEnabled {
  checkoutCategory: { enabled: boolean };
  discountSpin: { enabled: boolean; delaySeconds: number; durationSeconds: number };
  freeDelivery: { enabled: boolean; durationSeconds: number };
  promoCode: { enabled: boolean };
}

export interface UserGamification {
  checkoutCategory: CheckoutGamificationCategory;
  discountSpin: DiscountSpinGamificationCategory;
  freeDelivery: FreeDeliveryGamificationCategory;
  promoCode: PromoCodeGamificationCategory;
  serverTime: string;
  serverTimeMs: number;
}

export type GamificationScope =
  | "Fixed Amount"
  | "5% discount on all pruchase"
  | "Percentage discount";

export interface SpinScope {
  adminId: string;
  createdAt: string;
  image: string;
  isActive: boolean;
  scope: GamificationScope;
  updatedAt: string;
  value: number;
  _id: string;
}

export interface SpinFunction {
  isActive: boolean;
  isAdminActive: boolean;
  _id: string;
  scopeId: SpinScope;
}

export interface CheckoutCategoryItems {
  imageUrl: string;
  tag: string;
  isActive: boolean;
  _id: string;
}
export interface CheckoutCategory {
  _id: string;
  adminId: string;
  category: string;
  purchaseRange: number;
  updatedAt: string;
  items: CheckoutCategoryItems[];
}

export interface SpinItems {
  adminId: string;
  campaign: string;
  createdAt: string;
  description: string;
  discountUsage: unknown[];
  endDate: string;
  endTime: string;
  isActive: boolean;
  startDate: string;
  startTime: string;
  targetAudience: string;
  updatedAt: string;
  usageLimitPerUser: number;
  functions: SpinFunction[];
  _id: string;
}
/** A single toggleable gamification reward shown in the cart totals. */
export interface RewardToggle {
  type: Exclude<GamificationRewardType, "checkoutCategory">;
  /** Label on the toggle row, e.g. "Apply Spin & Win reward". */
  label: string;
  /** Label on the discount line shown once applied, e.g. "Spin & Win Discount". */
  discountLabel: string;
  /** Naira amount deducted when this reward is applied. */
  discount: number;
  isApplied: boolean;
  onToggle: (value: boolean) => void;
}

/** A discount actually applied to the checkout total (toggled or dashboard-selected). */
export interface AppliedDiscount {
  type: Exclude<GamificationRewardType, "checkoutCategory">;
  /** Human label, e.g. "Free Delivery Discount". */
  label: string;
  /** Naira amount deducted. */
  amount: number;
}

export interface CartTotalProps {
  /** Whether the totals are still resolving (fees / first-order checks). */
  isLoading: boolean;
  subtotal: number;
  deliveryCharge: number;
  serviceCharge: number;
  /** Total after any applied discounts. */
  total: number;
  accountType: UserResponse["accountType"] | undefined;
  /** Whether to show the promo-code card. */
  canUsePromoCode: boolean;
  onProceedToCheckout: () => void;
}

export interface PromoCodeResponse {
  campaign: string;
  customerInfo: null;
  description: string;
  expiresAt: number;
  image: string;
  minimumOrderValue: number;
  scope: GamificationScope;
  startsAt: number;
  targetAudience: string;
  value: number;
  rewardHistory: RewardHistory;
}
