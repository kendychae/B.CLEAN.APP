import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@config/firebase';
import { Analytics, Job, Customer, JobStatus } from '@appTypes/index';

export const getAnalytics = async (): Promise<Analytics> => {
  try {
    // Fetch all jobs
    const jobsSnapshot = await getDocs(collection(db, 'jobs'));
    const jobs: Job[] = [];
    jobsSnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() } as Job);
    });

    // Fetch all customers
    const customersSnapshot = await getDocs(
      query(collection(db, 'customers'), where('status', '==', 'active'))
    );
    const activeCustomers = customersSnapshot.size;

    // Calculate analytics
    const totalRevenue = jobs.reduce((sum, job) => sum + job.price, 0);
    const completedJobs = jobs.filter((job) => job.status === JobStatus.COMPLETED).length;
    const averageJobValue = jobs.length > 0 ? totalRevenue / jobs.length : 0;

    // Revenue by month (last 12 months)
    const revenueByMonth = calculateRevenueByMonth(jobs);

    // Top technician (placeholder)
    const topTechnician = 'John Doe';

    return {
      totalRevenue,
      totalJobs: jobs.length,
      completedJobs,
      activeCustomers,
      averageJobValue,
      topTechnician,
      revenueByMonth,
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
};

const calculateRevenueByMonth = (jobs: Job[]) => {
  const monthlyRevenue: Record<string, number> = {};
  const now = new Date();
  
  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyRevenue[key] = 0;
  }

  // Calculate revenue for each month
  jobs.forEach((job) => {
    if (job.status === JobStatus.COMPLETED && job.completedAt) {
      const date = new Date(job.completedAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyRevenue[key] !== undefined) {
        monthlyRevenue[key] += job.price;
      }
    }
  });

  return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue,
  }));
};
