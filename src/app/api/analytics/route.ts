import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { analyticsdata_v1beta } from 'googleapis';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });

    const analytics = google.analyticsdata({
      version: 'v1beta',
      auth,
    });

    const response = await analytics.properties.runReport({
      property: `properties/${process.env.GA_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [{
          startDate: '30daysAgo',
          endDate: 'today',
        }],
        metrics: [{
          name: 'screenPageViews',
        }],
        dimensions: [{
          name: 'pagePath',
        }],
      },
    });

    const totalScans = response.data.rows?.reduce((sum: number, row: analyticsdata_v1beta.Schema$Row) => {
      if (row.dimensionValues?.[0].value?.includes('/letter')) {
        return sum + Number(row.metricValues?.[0].value || 0);
      }
      return sum;
    }, 0) || 0;

    return NextResponse.json({ totalScans });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
} 