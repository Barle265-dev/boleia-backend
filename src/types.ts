enum TypeUserRole {
  PASSENGER = "passenger",
  DRIVER = "driver",
  FRETISTA = "fretista",
}

export const UserRole = TypeUserRole;
export type UserRole = `${TypeUserRole}`;

enum TypeDocumentType {
  DRIVING_LICENSE = "driving_license",
  NATIONAL_ID = "national_id",
  VEHICLE_REGISTRATION = "vehicle_registration",
}

export const DocumentType = TypeDocumentType;
export type DocumentType = keyof typeof TypeDocumentType;

enum TypeDocumentStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export const DocumentStatus = TypeDocumentStatus;
export type DocumentStatus = keyof typeof TypeDocumentStatus;

enum TypeRideStatus {
  AVAILABLE = "available",
  FULL = "full",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const RideStatus = TypeRideStatus;
export type RideStatus = keyof typeof TypeRideStatus;

enum TypeNotificationType {
  REQUEST = "request",
  CONFIRMATION = "confirmation",
  MESSAGE = "message",
  SYSTEM = "system",
}

export const NotificationType = TypeNotificationType;
export type NotificationType = keyof typeof TypeNotificationType;

enum TypeFreightRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

export const FreightRequestStatus = TypeFreightRequestStatus;
export type FreightRequestStatus = keyof typeof TypeFreightRequestStatus;

export type SortOrder = "asc" | "desc";

export interface ChangePasswordDTO {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserDto {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  role?: UserRole;
  isVerified?: boolean;
  rating?: number;
  totalTrips?: number;
  isBlocked?: boolean;
  password: string;
}

export interface UpdateUserDto extends Partial<UserDto> {}

export interface CreatePermissionDto {
  id?: string;
  name: string;
}

export interface UpdatePermissionDto extends Partial<CreatePermissionDto> {}

export interface CreateUserPermissionDto {
  userId: string;
  permissionId: string;
}

export interface UpdateUserPermissionDto {
  userId?: string;
  permissionId?: string;
}

export interface CreateUserDocumentDto {
  id?: string;
  name: string;
  type: DocumentType;
  url: string;
  status?: DocumentStatus;
  userId: string;
}

export interface UpdateUserDocumentDto extends Partial<CreateUserDocumentDto> {}

export interface CreateVehicleDto {
  id?: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  photoUrl?: string;
  userId: string;
}

export interface UpdateVehicleDto extends Partial<CreateVehicleDto> {}

export interface CreateRideDto {
  id?: string;
  origin: string;
  destination: string;
  departureTime: Date | string;
  availableSeats: number;
  totalSeats: number;
  price?: number;
  observations?: string;
  status?: RideStatus;
  driverId: string;
  vehicleId: string;
}

export interface UpdateRideDto extends Partial<CreateRideDto> {}

export interface CreateMessageDto {
  id?: string;
  text: string;
  senderId: string;
  recipientId?: string;
  rideId?: string;
}

export interface UpdateMessageDto extends Partial<CreateMessageDto> {}

export interface CreateNotificationDto {
  id?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead?: boolean;
  link?: string;
  userId: string;
}

export interface UpdateNotificationDto extends Partial<CreateNotificationDto> {}

export interface CreateFreightRequestDto {
  id?: string;
  origin: string;
  destination: string;
  requestedTime?: Date | string;
  status?: FreightRequestStatus;
  requesterId: string;
  fretistaId?: string;
  specificFretistaId?: string;
}

export interface UpdateFreightRequestDto extends Partial<CreateFreightRequestDto> {}
