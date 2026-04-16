const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();

// Create Stripe payment intent
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { amount, currency, customerId } = data;

  // Input validation
  if (!amount || typeof amount !== 'number' || amount <= 0 || amount > 99999999) {
    throw new functions.https.HttpsError('invalid-argument', 'Amount must be a positive number.');
  }
  if (customerId && typeof customerId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid customer ID.');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // ensure integer cents
      currency: currency || 'usd',
      metadata: { customerId: customerId || '', userId: context.auth.uid },
    });

    return {
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: null,
      customer: customerId,
    };
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw new functions.https.HttpsError('internal', 'Payment processing failed. Please try again.');
  }
});

// Send push notification
exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { userId, title, body, data: notificationData } = data;

  // Input validation
  if (!userId || typeof userId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Valid user ID is required.');
  }
  if (!title || typeof title !== 'string' || title.length > 200) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid title is required (max 200 chars).');
  }
  if (!body || typeof body !== 'string' || body.length > 1000) {
    throw new functions.https.HttpsError('invalid-argument', 'Valid body is required (max 1000 chars).');
  }

  try {
    // Get user's push token
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const pushToken = userDoc.data()?.pushToken;

    if (!pushToken) {
      throw new Error('User does not have a push token');
    }

    // Send notification
    const message = {
      notification: {
        title,
        body,
      },
      data: notificationData,
      token: pushToken,
    };

    await admin.messaging().send(message);

    // Create notification record
    await admin.firestore().collection('notifications').add({
      userId,
      title,
      body,
      data: notificationData,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Send notification error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification.');
  }
});

// Trigger on job completion
exports.onJobComplete = functions.firestore
  .document('jobs/{jobId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if job was just completed
    if (before.status !== 'completed' && after.status === 'completed') {
      const customerId = after.customerId;
      const customerDoc = await admin
        .firestore()
        .collection('customers')
        .doc(customerId)
        .get();
      
      const customer = customerDoc.data();

      if (customer && customer.phone) {
        // Here you would integrate with an SMS service
        // For now, we'll create a notification
        await admin.firestore().collection('notifications').add({
          userId: after.assignedTo,
          title: 'Job Completed',
          body: `Job for ${customer.name} has been marked as complete. Send review request?`,
          data: {
            type: 'job_complete',
            jobId: context.params.jobId,
            customerId,
            customerPhone: customer.phone,
          },
          read: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Update customer's last service date
      await admin.firestore().collection('customers').doc(customerId).update({
        lastServiceDate: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return null;
  });

// Calculate analytics (scheduled function)
exports.calculateAnalytics = functions.pubsub
  .schedule('0 0 * * *') // Run daily at midnight
  .timeZone('America/New_York')
  .onRun(async (context) => {
    // Fetch all jobs
    const jobsSnapshot = await admin.firestore().collection('jobs').get();
    const jobs = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // Calculate metrics
    const totalRevenue = jobs.reduce((sum, job) => sum + (job.price || 0), 0);
    const completedJobs = jobs.filter((job) => job.status === 'completed').length;
    const averageJobValue = jobs.length > 0 ? totalRevenue / jobs.length : 0;

    // Store analytics
    await admin.firestore().collection('analytics').doc('latest').set({
      totalRevenue,
      totalJobs: jobs.length,
      completedJobs,
      averageJobValue,
      calculatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  });

// Create employee account without signing out the admin
exports.createEmployee = functions.https.onCall(async (data, context) => {
  // Must be authenticated and admin role
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Must be signed in.');
  }

  const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can create employees.');
  }

  const { email, password, displayName, role } = data;

  if (!email || !password || !displayName || !role) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields.');
  }

  try {
    // Create Firebase Auth user (server-side, does not affect caller session)
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    // Create Firestore user document
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { uid: userRecord.uid, success: true };
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError('already-exists', 'That email is already registered.');
    }
    console.error('Create employee error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create employee account.');
  }
});
