
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

interface ApplicationEmailPayload {
  applicationType: 'new' | 'status-change'
  applicationId: string
  message?: string
  newStatus?: string
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Get the JWT from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the request payload
    const { applicationType, applicationId, message, newStatus } = await req.json() as ApplicationEmailPayload

    // Fetch the application data
    const { data: application, error: appError } = await supabase
      .from('job_applications')
      .select(`
        *,
        jobs:job_id (
          title,
          company,
          company_id,
          description
        )
      `)
      .eq('id', applicationId)
      .single()

    if (appError || !application) {
      return new Response(
        JSON.stringify({ error: 'Application not found', details: appError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Fetch company data to get the company email
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('name, id')
      .eq('id', application.jobs.company_id)
      .single()

    if (companyError || !company) {
      return new Response(
        JSON.stringify({ error: 'Company not found', details: companyError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get company owner's email
    const { data: companyOwner, error: ownerError } = await supabase
      .from('users')
      .select('email')
      .eq('id', application.jobs.company_id)
      .single()

    const companyEmail = companyOwner?.email || 'no-reply@updates.trytadam.com'

    // Prepare email content based on application type
    let candidateEmail: EmailPayload
    let companyEmail_: EmailPayload | null = null

    if (applicationType === 'new') {
      // Email to candidate
      candidateEmail = {
        to: application.email,
        subject: `Application Received: ${application.jobs.title} at ${application.jobs.company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Application Received</h2>
            <p>Dear ${application.full_name},</p>
            <p>Thank you for applying to the <strong>${application.jobs.title}</strong> position at <strong>${application.jobs.company}</strong>.</p>
            <p>Your application has been received and is currently under review. We will contact you if your qualifications match our requirements.</p>
            <p>Job details:</p>
            <ul>
              <li><strong>Position:</strong> ${application.jobs.title}</li>
              <li><strong>Company:</strong> ${application.jobs.company}</li>
              <li><strong>Status:</strong> Pending Review</li>
            </ul>
            <p>Best regards,</p>
            <p>The ${application.jobs.company} Team</p>
          </div>
        `,
        from: `${company.name} <onboarding@resend.dev>`
      }

      // Email to company
      companyEmail_ = {
        to: companyEmail,
        subject: `New Job Application: ${application.jobs.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Job Application</h2>
            <p>A new application has been submitted for the <strong>${application.jobs.title}</strong> position.</p>
            <p>Applicant details:</p>
            <ul>
              <li><strong>Name:</strong> ${application.full_name}</li>
              <li><strong>Email:</strong> ${application.email}</li>
              <li><strong>Phone:</strong> ${application.phone || 'Not provided'}</li>
            </ul>
            <p>You can review this application in your dashboard.</p>
          </div>
        `,
        from: 'JobBoard <onboarding@resend.dev>'
      }
    } else if (applicationType === 'status-change') {
      // Email to candidate about status change
      let statusMessage = ''

      switch (newStatus) {
        case 'reviewed':
          statusMessage = 'Your application has been reviewed by the hiring team.'
          break
        case 'interviewing':
          statusMessage = 'Congratulations! Your application has been selected for an interview. The hiring team will contact you soon with more details.'
          break
        case 'accepted':
          statusMessage = 'Congratulations! We are pleased to inform you that your application has been accepted. The hiring team will contact you soon with next steps.'
          break
        case 'rejected':
          statusMessage = message 
            ? `We regret to inform you that your application was not selected for this position. ${message}`
            : 'We regret to inform you that your application was not selected for this position. We appreciate your interest and wish you success in your job search.'
          break
        default:
          statusMessage = `Your application status has been updated to: ${newStatus}.`
      }

      candidateEmail = {
        to: application.email,
        subject: `Application Status Update: ${application.jobs.title} at ${application.jobs.company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Application Status Update</h2>
            <p>Dear ${application.full_name},</p>
            <p>${statusMessage}</p>
            <p>Job details:</p>
            <ul>
              <li><strong>Position:</strong> ${application.jobs.title}</li>
              <li><strong>Company:</strong> ${application.jobs.company}</li>
              <li><strong>Status:</strong> ${newStatus?.charAt(0).toUpperCase()}${newStatus?.slice(1)}</li>
            </ul>
            <p>Best regards,</p>
            <p>The ${application.jobs.company} Team</p>
          </div>
        `,
        from: `${company.name} <onboarding@resend.dev>`
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid application type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send emails using Resend API
    const emails = [candidateEmail]
    if (companyEmail_) emails.push(companyEmail_)

    // Add debugging
    console.log("Sending emails to Resend API:", emails);
    console.log("Using Resend API Key (first 4 chars):", RESEND_API_KEY.substring(0, 4) + "...");

    const results = await Promise.all(emails.map(async (email) => {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: email.from || 'JobBoard <onboarding@resend.dev>',
            to: email.to,
            subject: email.subject,
            html: email.html
          })
        });
        
        const responseData = await response.json();
        console.log("Resend API response:", responseData);
        return responseData;
      } catch (error) {
        console.error("Error sending email via Resend:", error);
        return { error: error.message };
      }
    }));

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
