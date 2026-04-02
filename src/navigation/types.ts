export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

export type DashboardStackParamList = {
  DashboardHome: undefined;
  GroupSMS: undefined;
};

export type MapStackParamList = {
  MapHome: undefined;
};

export type ScheduleStackParamList = {
  ScheduleHome: undefined;
};

export type CustomersStackParamList = {
  CustomersList: undefined;
  CustomerDetail: { customerId: string };
  AddEditCustomer: { customerId?: string };
};

export type JobsStackParamList = {
  JobsList: undefined;
  JobDetail: { jobId: string };
  AddEditJob: { jobId?: string; customerId?: string; selectedDate?: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  Availability: undefined;
};
