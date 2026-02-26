# B.CLEAN Database Schema

## Collections

### users
Stores user account information and roles.

```typescript
{
  id: string (document ID)
  email: string
  displayName: string
  role: 'admin' | 'salesperson' | 'technician'
  phoneNumber?: string
  photoURL?: string
  pushToken?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- email (ascending)
- role (ascending)

---

### customers
Stores customer information and contact details.

```typescript
{
  id: string (document ID)
  name: string
  email?: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    coordinates: {
      latitude: number
      longitude: number
    }
  }
  assignedTechnician?: string (user ID reference)
  status: 'active' | 'inactive' | 'dnc'
  notes?: string
  totalRevenue: number
  lastServiceDate?: timestamp
  createdBy: string (user ID reference)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- status (ascending)
- zipCode (ascending)
- assignedTechnician (ascending)
- createdAt (descending)
- Composite: status (ascending) + createdAt (descending)
- Composite: assignedTechnician (ascending) + status (ascending)

---

### jobs
Stores job/appointment information.

```typescript
{
  id: string (document ID)
  customerId: string (customer ID reference)
  customerName: string
  assignedTo: string (user ID reference)
  assignedToName: string
  scheduledDate: timestamp
  scheduledTime: string
  duration: number (minutes)
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  price: number
  paymentStatus: 'unpaid' | 'paid' | 'pending' | 'refunded'
  notes?: string
  beforePhotos?: string[] (storage URLs)
  afterPhotos?: string[] (storage URLs)
  signature?: string (storage URL)
  calendarEventId?: string
  completedAt?: timestamp
  createdBy: string (user ID reference)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- assignedTo (ascending)
- status (ascending)
- scheduledDate (ascending)
- customerId (ascending)
- Composite: assignedTo (ascending) + scheduledDate (ascending)
- Composite: assignedTo (ascending) + status (ascending)
- Composite: status (ascending) + scheduledDate (ascending)

---

### availability
Stores employee availability schedules.

```typescript
{
  id: string (document ID)
  userId: string (user ID reference)
  date: timestamp
  slots: Array<{
    startTime: string
    endTime: string
    isAvailable: boolean
  }>
  isFullDayOff: boolean
  reason?: string
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- userId (ascending)
- date (ascending)
- Composite: userId (ascending) + date (ascending)

---

### mapPins
Stores real-time map pins for sales tracking.

```typescript
{
  id: string (document ID)
  type: 'customer' | 'lead' | 'dnc'
  customerId?: string (customer ID reference)
  coordinates: {
    latitude: number
    longitude: number
  }
  address: string
  name?: string
  phone?: string
  notes?: string
  createdBy: string (user ID reference)
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- type (ascending)
- createdBy (ascending)
- Composite: type (ascending) + createdAt (descending)

---

### invoices
Stores invoice and payment information.

```typescript
{
  id: string (document ID)
  jobId: string (job ID reference)
  customerId: string (customer ID reference)
  customerName: string
  amount: number
  tax: number
  total: number
  paymentStatus: 'unpaid' | 'paid' | 'pending' | 'refunded'
  stripePaymentIntentId?: string
  pdfUrl?: string (storage URL)
  sentAt?: timestamp
  paidAt?: timestamp
  createdAt: timestamp
  updatedAt: timestamp
}
```

**Indexes:**
- customerId (ascending)
- jobId (ascending)
- paymentStatus (ascending)
- createdAt (descending)
- Composite: paymentStatus (ascending) + createdAt (descending)

---

### notifications
Stores in-app notifications for users.

```typescript
{
  id: string (document ID)
  userId: string (user ID reference)
  title: string
  body: string
  data?: object
  read: boolean
  createdAt: timestamp
}
```

**Indexes:**
- userId (ascending)
- read (ascending)
- Composite: userId (ascending) + read (ascending) + createdAt (descending)

---

## Firestore Rules Summary

### Permission Matrix

| Collection     | Admin | Salesperson | Technician |
|---------------|-------|-------------|------------|
| users         | CRUD  | R           | R          |
| customers     | CRUD  | CRU         | CR         |
| jobs          | CRUD  | CR          | RU (own)   |
| availability  | CRUD  | CRU (own)   | CRU (own)  |
| mapPins       | CRUD  | CRU         | R          |
| invoices      | CRUD  | R           | CR         |
| notifications | CRUD  | RU (own)    | RU (own)   |

**Legend:**
- C = Create
- R = Read
- U = Update
- D = Delete
- (own) = Only records assigned to or created by the user

---

## Cloud Functions

Recommended Cloud Functions to implement:

1. **createPaymentIntent** - Create Stripe payment intent
2. **generateInvoice** - Generate PDF invoice
3. **sendNotification** - Send push notification to user
4. **onJobComplete** - Trigger review request SMS
5. **calculateAnalytics** - Aggregate analytics data
6. **syncCalendar** - Sync jobs with external calendars

---

## Storage Structure

```
/jobs
  /{jobId}
    /before_{timestamp}.jpg
    /after_{timestamp}.jpg
    /signature_{timestamp}.png

/profiles
  /{userId}
    /photo.jpg

/invoices
  /{invoiceId}
    /invoice.pdf
```
